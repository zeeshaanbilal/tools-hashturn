import sys
from pdf2docx import Converter

def main():
    if len(sys.argv) < 3:
        print("Usage: python pdf_to_word.py <input.pdf> <output.docx>")
        sys.exit(1)
        
    input_pdf = sys.argv[1]
    output_docx = sys.argv[2]
    
    cv = Converter(input_pdf)
    cv.convert(output_docx)
    cv.close()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        import traceback
        print(f"Error: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
