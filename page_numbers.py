import sys
import fitz

def main():
    if len(sys.argv) < 3:
        sys.exit(1)
        
    input_pdf = sys.argv[1]
    output_pdf = sys.argv[2]
    
    doc = fitz.open(input_pdf)
    for i, page in enumerate(doc):
        text = str(i + 1)
        p = fitz.Point(page.rect.width / 2, page.rect.height - 30)
        page.insert_text(p, text, fontsize=12, color=(0,0,0))
    
    doc.save(output_pdf)
    doc.close()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        import traceback
        print(f"Error: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
