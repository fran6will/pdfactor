from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PyPDF2 import PdfWriter, PdfReader
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    try:
        uploaded_file = request.files['file']
        character_name = request.form['character']

        if not uploaded_file:
            return jsonify({"error": "No file uploaded"}), 400

        reader = PdfReader(uploaded_file)
        writer = PdfWriter()

        character_found = False

        for page in reader.pages:
            if character_name in page.extract_text():
                writer.add_page(page)
                character_found = True

        if not character_found:
            return jsonify({"error": f"Character '{character_name}' not found in the PDF"}), 400

        output_pdf = io.BytesIO()
        writer.write(output_pdf)
        output_pdf.seek(0)

        return send_file(output_pdf, attachment_filename="processed_script.pdf", as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
