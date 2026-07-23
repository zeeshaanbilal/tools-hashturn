import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, PDFName, PDFArray, PDFRawStream, PDFDict } from "pdf-lib";
import pako from "pako"; // Required for zlib decompression
import { requireToolAuth } from "../utils/auth";
import { withToolAuth } from "@/lib/withToolAuth";

async function handler(req: NextRequest, props: any, userId: string) {
    try {
        // Authenticate the request
        const authError = await requireToolAuth(req);
        if (authError) return authError;

        // Extract the file from the FormData
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
            return NextResponse.json(
                { error: "Only .pdf files are supported" },
                { status: 400 }
            );
        }

        // Load the PDF into memory
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        // Safely lookup the AcroForm dictionary
        const acroForm = pdfDoc.catalog.lookup(PDFName.of("AcroForm")) as PDFDict;

        if (!acroForm || !acroForm.has(PDFName.of("XFA"))) {
            return NextResponse.json(
                { error: "No XFA data found in the PDF. This may not be an XFA form." },
                { status: 404 }
            );
        }

        // Locate the XFA data structure
        const xfa = pdfDoc.context.lookup(acroForm.get(PDFName.of("XFA")));
        let xmlContent = "";

        // Helper function to extract and decompress PDF stream contents
        const extractStreamContent = (stream: PDFRawStream) => {
            let bytes = stream.contents;
            const filter = pdfDoc.context.lookup(stream.dict.get(PDFName.of("Filter")));

            // Check if the stream is zlib compressed (FlateDecode)
            let isFlate = false;
            if (filter === PDFName.of("FlateDecode")) {
                isFlate = true;
            } else if (filter instanceof PDFArray) {
                for (let i = 0; i < filter.size(); i++) {
                    if (filter.get(i) === PDFName.of("FlateDecode")) isFlate = true;
                }
            }

            // Decompress if necessary
            if (isFlate) {
                try {
                    bytes = pako.inflate(bytes);
                } catch (e) {
                    console.warn("Failed to decompress XFA stream chunk:", e);
                }
            }

            // Convert raw bytes back into readable text
            return new TextDecoder("utf-8").decode(bytes);
        };

        // Extract the XML chunks
        // XFA can be stored as a single stream or an array of [String, Stream] pairs
        if (xfa instanceof PDFArray) {
            for (let i = 0; i < xfa.size(); i++) {
                const obj = pdfDoc.context.lookup(xfa.get(i));
                // We only want the raw streams containing the XML, not the structural tags
                if (obj instanceof PDFRawStream) {
                    xmlContent += extractStreamContent(obj);
                }
            }
        } else if (xfa instanceof PDFRawStream) {
            xmlContent = extractStreamContent(xfa);
        }

        if (!xmlContent) {
            return NextResponse.json(
                { error: "Extracted XFA content is empty." },
                { status: 500 }
            );
        }

        // Return the extracted XML as a downloadable file
        return new NextResponse(xmlContent, {
            status: 200,
            headers: {
                "Content-Type": "application/xml",
                "Content-Disposition": `attachment; filename="${file.name.replace(/\.\w+$/, "")}.xml"`,
            },
        });

    } catch (err) {
        console.error("XFA Extraction Error:", err);
        return NextResponse.json(
            { error: `Conversion failed: ${(err as Error).message}` },
            { status: 500 }
        );
    }
}

export const POST = withToolAuth(handler);