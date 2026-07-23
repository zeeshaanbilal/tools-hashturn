import sys
import fitz
import zipfile
import os

def main():
    if len(sys.argv) < 3:
        sys.exit(1)
        
    input_pdf = sys.argv[1]
    output_zip = sys.argv[2]
    
    doc = fitz.open(input_pdf)
    image_files = []
    
    # Extract images to temporary PNG files
    temp_dir = os.path.dirname(output_zip)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=150)
        img_path = os.path.join(temp_dir, f"page_{i+1}.png")
        pix.save(img_path)
        image_files.append(img_path)
        
    doc.close()
    
    # Zip the images
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
        for img_path in image_files:
            zf.write(img_path, arcname=os.path.basename(img_path))
            
    # Clean up individual images
    for img_path in image_files:
        try:
            os.remove(img_path)
        except:
            pass

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        import traceback
        print(f"Error: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
