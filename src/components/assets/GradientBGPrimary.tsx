export default function GradientBGPrimary() {
  return (
    <div className="absolute top-0 left-0 w-full h-full" style={{background: 'linear-gradient(to left, #CD1C18 0%, #66023C 100%)'}}>
      <img
        src="/texture-1.png"
        style={{ objectFit: "contain" }}
        alt="background texture"
      />
    </div>
  );
}
