import { jsPDF } from "jspdf";
import { NDAFormData } from "./Footer.types";

export const generateNDAPDFServer = (
  ndaData: NDAFormData
): { content: Buffer; filename: string } => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let y = 20;

  doc.setFontSize(18);
  doc.text("MUTUAL NON-DISCLOSURE AGREEMENT", pageWidth / 2, y, {
    align: "center",
  });

  y += 15;
  doc.setFontSize(11);

  const addText = (text: string, fontSize = 11, isBold = false) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont("helvetica", "bold");
    } else {
      doc.setFont("helvetica", "normal");
    }
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  addText(
    `This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of ${ndaData.effectiveDate} ("Effective Date") by and between:`,
    11
  );

  y += 2;
  addText(
    `Party A: ${ndaData.legalEntityName} ("Disclosing Party")`,
    11,
    true
  );
  addText(`Party B: Aaron Gazzola ("Receiving Party")`, 11, true);

  y += 3;
  addText(
    `This Agreement shall be governed by the laws of ${ndaData.jurisdiction}.`,
    11
  );

  y += 5;
  addText("1. PURPOSE", 12, true);
  addText(
    'The parties wish to explore a business opportunity of mutual interest and benefit (the "Purpose"), which may involve the disclosure of Confidential Information (as defined below). In consideration of the mutual covenants and agreements contained in this Agreement, the parties agree as follows:',
    11
  );

  y += 3;
  addText("2. DEFINITION OF CONFIDENTIAL INFORMATION", 12, true);
  addText(
    '"Confidential Information" means any and all information disclosed by either party to the other party, whether orally, in writing, or in any other form, including but not limited to:',
    11
  );

  y += 2;
  const confidentialItems = [
    "Source code, software, algorithms, and technical specifications",
    "Business plans, strategies, financial information, and forecasts",
    "Customer lists, supplier information, and business relationships",
    "Trade secrets, inventions, designs, and proprietary methodologies",
    'Any information marked as "Confidential" or that reasonably should be understood to be confidential',
  ];

  confidentialItems.forEach((item) => {
    addText(`• ${item}`, 10);
  });

  y += 3;
  addText("3. OBLIGATIONS OF RECEIVING PARTY", 12, true);
  addText("The Receiving Party agrees to:", 11);

  y += 2;
  const obligations = [
    "Hold and maintain the Confidential Information in strict confidence",
    "Not disclose the Confidential Information to any third parties without prior written consent",
    "Not use the Confidential Information for any purpose other than the Purpose",
    "Protect the Confidential Information with the same degree of care used to protect its own confidential information, but not less than reasonable care",
    "Only disclose Confidential Information to employees or contractors who have a legitimate need to know and who are bound by confidentiality obligations",
  ];

  obligations.forEach((item) => {
    addText(`• ${item}`, 10);
  });

  y += 3;
  addText("4. EXCLUSIONS FROM CONFIDENTIAL INFORMATION", 12, true);
  addText("Confidential Information does not include information that:", 11);

  y += 2;
  const exclusions = [
    "Was publicly known at the time of disclosure or becomes publicly known through no breach of this Agreement",
    "Was known to the Receiving Party prior to disclosure by the Disclosing Party",
    "Is rightfully received by the Receiving Party from a third party without breach of any confidentiality obligation",
    "Is independently developed by the Receiving Party without use of or reference to the Confidential Information",
  ];

  exclusions.forEach((item) => {
    addText(`• ${item}`, 10);
  });

  y += 3;
  addText("5. TERM", 12, true);
  addText(
    "This Agreement shall commence on the Effective Date and continue for a period of three (3) years, unless earlier terminated by either party upon thirty (30) days written notice to the other party. The obligations of confidentiality shall survive termination of this Agreement for a period of five (5) years.",
    11
  );

  y += 3;
  addText("6. RETURN OF MATERIALS", 12, true);
  addText(
    "Upon request by the Disclosing Party or upon termination of this Agreement, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof, and certify in writing that such return or destruction has been completed.",
    11
  );

  y += 3;
  addText("7. NO LICENSE", 12, true);
  addText(
    "Nothing in this Agreement grants any license or right to the Receiving Party in or to the Confidential Information, except as expressly stated herein. All intellectual property rights remain with the Disclosing Party.",
    11
  );

  y += 3;
  addText("8. NO WARRANTY", 12, true);
  addText(
    'All Confidential Information is provided "AS IS" without warranty of any kind, express or implied. The Disclosing Party makes no representation as to the accuracy or completeness of the Confidential Information.',
    11
  );

  y += 3;
  addText("9. REMEDIES", 12, true);
  addText(
    "The parties acknowledge that any breach of this Agreement may cause irreparable harm for which monetary damages would be an inadequate remedy. Accordingly, the parties agree that the non-breaching party shall be entitled to seek equitable relief, including injunction and specific performance, in addition to all other remedies available at law or in equity.",
    11
  );

  y += 3;
  addText("10. GOVERNING LAW AND JURISDICTION", 12, true);
  addText(
    `This Agreement shall be governed by and construed in accordance with the laws of ${ndaData.jurisdiction}, without regard to its conflict of law provisions. Any disputes arising under this Agreement shall be subject to the exclusive jurisdiction of the courts of ${ndaData.jurisdiction}.`,
    11
  );

  y += 3;
  addText("11. ENTIRE AGREEMENT", 12, true);
  addText(
    "This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous understandings, agreements, negotiations, representations, and warranties, both written and oral.",
    11
  );

  y += 3;
  addText("12. AMENDMENTS", 12, true);
  addText(
    "This Agreement may only be amended, modified, or supplemented by a written agreement signed by both parties.",
    11
  );

  y += 10;
  addText("SIGNATURES", 12, true);

  y += 5;
  addText("Party A (Disclosing Party):", 11, true);
  y += 2;
  addText(`Name: ${ndaData.legalEntityName}`, 11);
  y += 8;
  addText("Signature: _________________________", 11);
  y += 8;
  addText("Date: _________________________", 11);

  y += 10;
  addText("Party B (Receiving Party):", 11, true);
  y += 2;
  addText("Name: Aaron Gazzola", 11);
  y += 8;
  addText("Signature: _________________________", 11);
  y += 8;
  addText("Date: _________________________", 11);

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  const filename = `NDA_${ndaData.legalEntityName.replace(/\s+/g, "_")}_${ndaData.effectiveDate}.pdf`;

  return {
    content: pdfBuffer,
    filename,
  };
};
