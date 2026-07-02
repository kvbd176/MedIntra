from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors


def generate_invoice_pdf(
    pharmacy_name,
    owner_name,
    phone,
    invoice_id,
    customer_name,
    customer_phone,
    items,
    total_amount,
    filename
):

    doc = SimpleDocTemplate(
        filename,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    content = []

    # --------------------
    # Title
    # --------------------

    content.append(
    Paragraph(
        f"<b>{pharmacy_name}</b>",
        styles["Title"]
    )
    )
    content.append(
    Paragraph(
        f"Owner: {owner_name}",
        styles["Normal"]
    )
    )

    content.append(
        Paragraph(
            f"Phone: {phone}",
            styles["Normal"]
        )
    )
    content.append(Spacer(1, 25))

    # --------------------
    # Invoice Info
    # --------------------

    content.append(
        Paragraph(
            f"<font size='14'><b>Invoice No: #{invoice_id}</b></font>",
            styles["Normal"]
        )
    )

    content.append(Spacer(1, 10))

    content.append(
        Paragraph(
            f"<b>Customer Name:</b> {customer_name}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"<b>Phone Number:</b> {customer_phone}",
            styles["Normal"]
        )
    )

    content.append(Spacer(1, 20))

    # --------------------
    # Medicine Table
    # --------------------

    table_data = [
        ["Medicine Name", "Quantity", "Amount (Rs.)"]
    ]

    for item in items:

        table_data.append([
            item["medicine_name"],
            str(item["quantity"]),
            f"{item['subtotal']:.2f}"
        ])

    table = Table(
        table_data,
        colWidths=[260, 100, 120]
    )

    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#D9EAF7")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),

            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 12),

            ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
            ("FONTSIZE", (0, 1), (-1, -1), 11),

            ("GRID", (0, 0), (-1, -1), 1, colors.black),

            ("ALIGN", (1, 1), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),

            ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
            ("TOPPADDING", (0, 0), (-1, 0), 12),

            ("BOTTOMPADDING", (0, 1), (-1, -1), 8),
            ("TOPPADDING", (0, 1), (-1, -1), 8),
        ])
    )

    content.append(table)

    content.append(Spacer(1, 25))

    # --------------------
    # Total Amount
    # --------------------

    content.append(
        Paragraph(
            f"<font size='16'><b>Total Amount: Rs.{total_amount:.2f}</b></font>",
            styles["Heading2"]
        )
    )

    content.append(Spacer(1, 40))

    # --------------------
    # Footer
    # --------------------

    content.append(
        Paragraph(
            "<font size='12'><b>Thank You For Visiting!</b></font>",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            "<font size='10'>Get Well Soon • Visit Again</font>",
            styles["Normal"]
        )
    )

    doc.build(content)

    return filename