import sys
import fitz

def main():
    if len(sys.argv) < 3:
        sys.exit(1)
        
    input_pdf = sys.argv[1]
    output_md = sys.argv[2]
    
    doc = fitz.open(input_pdf)
    md_text = ""
    for page in doc:
        blocks = page.get_text("blocks")
        for b in blocks:
            text = b[4].strip()
            if text:
                md_text += text + "\n\n"
    
    with open(output_md, "w", encoding="utf-8") as f:
        f.write(md_text)
    doc.close()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        import traceback
        print(f"Error: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
