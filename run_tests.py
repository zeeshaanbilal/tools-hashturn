import subprocess
import sys
import os

scripts = {
    'page_numbers.py': ['test_input.pdf', 'test_output_page_numbers.pdf'],
    'repair_pdf.py': ['test_input.pdf', 'test_output_repair.pdf'],
    'pdf_to_word.py': ['test_input.pdf', 'test_output.docx'],
    'pdf_to_excel.py': ['test_input.pdf', 'test_output.xlsx'],
    'pdf_to_pptx.py': ['test_input.pdf', 'test_output.pptx'],
    'pdf_to_md.py': ['test_input.pdf', 'test_output.md']
}

print("Running Python Script Tests...")
all_passed = True

for script, args in scripts.items():
    print(f"Testing {script}...")
    try:
        result = subprocess.run(
            ['python', script] + args,
            capture_output=True,
            text=True,
            check=True
        )
        # Check if output file was created
        out_file = args[1]
        if os.path.exists(out_file) and os.path.getsize(out_file) > 0:
            print(f"  [SUCCESS] {script} ran without errors and generated output.")
        else:
            print(f"  [FAIL] {script} ran but output file is missing or empty.")
            all_passed = False
    except subprocess.CalledProcessError as e:
        print(f"  [ERROR] {script} failed with exit code {e.returncode}")
        print(f"  Stderr: {e.stderr}")
        all_passed = False

if all_passed:
    print("\nAll Python backend services passed!")
else:
    print("\nSome services failed. Check logs above.")
    sys.exit(1)
