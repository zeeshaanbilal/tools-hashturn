"use client";

import { useState, useEffect } from "react";
import { CircleCheck, Loader2 } from "lucide-react";
import { plans } from "@/content/plans";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginPopup from "@/components/popups/LoginPopup";
import CheckoutFailedPopup from "@/components/popups/CheckoutFailedPopup";

export default function Pricing() {
  const { data: session, status } = useSession();
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [checkoutFailedOpen, setCheckoutFailedOpen] = useState(false);
  const [checkoutFailedMessage, setCheckoutFailedMessage] = useState<string | null>(null);


  // Load user active plan
  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch("/api/plan/current");
        if (!res.ok) {
          setActivePlan(null);
          return;
        }
        const data = await res.json();
        setActivePlan(data?.planName ?? null);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchPlan();
  }, []);


  const choosePlan = async (planKey: string) => {
    setLoadingPlan(planKey);

    if (status !== "loading" && !session) {
      setLoadingPlan(null);
      setLoginPromptOpen(true);
      return;
    }

    if (planKey === "Free") {
      await fetch("/api/plan/switch-free", { method: "POST" });
      window.location.reload();
      return;
    }

    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });

      const data = await res.json().catch(() => ({}));

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      const message =
        typeof data?.error === "string" && data.error.length > 0
          ? data.error
          : res.ok
            ? "Checkout failed. Please try again."
            : "Checkout failed. Please try again.";

      setCheckoutFailedMessage(message);
      setCheckoutFailedOpen(true);
    } catch {
      setCheckoutFailedMessage("Checkout failed. Please check your connection and try again.");
      setCheckoutFailedOpen(true);
    } finally {
      setLoadingPlan(null);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen animate-spin">
        <Loader2 width={48} height={48} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {loginPromptOpen && (
        <LoginPopup
          setLoginPromptOpen={setLoginPromptOpen}
        />
      )}
      {checkoutFailedOpen && (
        <CheckoutFailedPopup
          setCheckoutFailedOpen={setCheckoutFailedOpen}
          message={checkoutFailedMessage ?? undefined}
        />
      )}
      <div className="text-center">
        <h1 className="text-4xl text-typography leading-relaxed tracking-wider font-semibold">
          Choose your plan
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div key={plan.key} className="cta-outer transition-transform hover:scale-105 duration-300 h-full">
            <div className="cta-mesh-card flex flex-col p-8 min-h-[520px] md:min-h-[560px] w-full h-full">
              <div className="cta-mesh-blob cta-mb-1"></div>
              <div className="cta-mesh-blob cta-mb-2"></div>
              <div className="cta-mesh-blob cta-mb-3"></div>
              <div className="cta-mesh-blob cta-mb-4"></div>
              <div className="cta-mesh-overlay"></div>
              
              <div className="cta-content flex flex-col h-full w-full text-left z-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-black">{plan.name}</h3>
                <h1 className="text-4xl font-extrabold mt-1 text-gray-900 dark:text-black">
                  ${plan.price}
                  <span className="text-3xl font-light">/mo</span>
                </h1>

                <div className="flex flex-col gap-5 text-lg font-normal mt-10 flex-grow text-gray-800 dark:text-black">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CircleCheck className="w-6 h-6 flex-shrink-0" fill="#e24b4a" color="#fff" />
                      <p className="leading-relaxed">{feature.name}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center w-full">
                  <button
                    disabled={
                      initialLoading ||
                      status === "loading" ||
                      loadingPlan !== null ||
                      activePlan === plan.name
                    }
                    onClick={() => choosePlan(plan.name)}
                    className={`cta-btn-grad cursor-pointer
                      ${activePlan === plan.name
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                      }`}
                  >
                    {activePlan === plan.name ? (
                      "Already Using"
                    ) : loadingPlan === plan.name ? (
                      <div className="flex justify-center animate-spin">
                        <Loader2 />
                      </div>
                    ) : (
                      "Choose Plan"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
