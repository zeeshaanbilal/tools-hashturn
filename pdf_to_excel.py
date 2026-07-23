import sys
import pdfplumber
import pandas as pd

def main():
    if len(sys.argv) < 3:
        print("Usage: python pdf_to_excel.py <input.pdf> <output.xlsx>")
        sys.exit(1)
        
    input_pdf = sys.argv[1]
    output_xlsx = sys.argv[2]
    
    tables_found = False
    startrow = 0
    
    with pdfplumber.open(input_pdf) as pdf:
        with pd.ExcelWriter(output_xlsx, engine='openpyxl') as writer:
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    if not table: continue
                    tables_found = True
                    
                    # Clean table data
                    cleaned_table = []
                    for row in table:
                        cleaned_row = [str(cell).replace('\n', ' ').strip() if cell is not None else "" for cell in row]
                        cleaned_table.append(cleaned_row)
                        
                    df = pd.DataFrame(cleaned_table)
                    df.to_excel(writer, sheet_name='Data', startrow=startrow, index=False, header=False)
                    startrow += len(df) + 2 # Leave 2 blank rows between tables
            
            # Fallback if no tables found at all: extract text lines
            if not tables_found:
                all_text = []
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        for line in text.split('\n'):
                            all_text.append([line.strip()])
                if all_text:
                    df = pd.DataFrame(all_text)
                    df.to_excel(writer, sheet_name='Data', index=False, header=False)
                else:
                    # Create an empty sheet if absolutely nothing
                    pd.DataFrame([["No text or tables found in PDF."]]).to_excel(writer, sheet_name='Data', index=False, header=False)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        import traceback
        print(f"Error: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
