import pdfplumber
import docx
from io import BytesIO

def extract_text_from_pdf(file_content: bytes) -> str:
    text = ""
    with pdfplumber.open(BytesIO(file_content)) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text

def extract_text_from_docx(file_content: bytes) -> str:
    doc = docx.Document(BytesIO(file_content))
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text(file_content: bytes, filename: str) -> str:
    if filename.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_content)
    elif filename.lower().endswith(".docx"):
        return extract_text_from_docx(file_content)
    else:
        # Fallback for plain text or unknown
        try:
            return file_content.decode("utf-8")
        except:
            return ""
