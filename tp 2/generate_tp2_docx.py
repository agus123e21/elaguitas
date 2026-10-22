import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_callout(doc, text, title=None):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F0F7FD")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}>'
                        f'<w:top w:val="none"/>'
                        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="0B7DC2"/>'
                        f'<w:bottom w:val="none"/>'
                        f'<w:right w:val="none"/>'
                        f'</w:tcBorders>')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(2)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    
    if title:
        run_title = p.add_run(f"📌 {title}\n")
        run_title.font.name = "Arial"
        run_title.font.size = Pt(10)
        run_title.font.bold = True
        run_title.font.color.rgb = RGBColor(11, 125, 194)
        
    run_text = p.add_run(text)
    run_text.font.name = "Arial"
    run_text.font.size = Pt(9.5)
    run_text.font.italic = True
    run_text.font.color.rgb = RGBColor(30, 41, 59)
    
    p_spacer = doc.add_paragraph()
    p_spacer.paragraph_format.space_before = Pt(0)
    p_spacer.paragraph_format.space_after = Pt(6)

def add_p(doc, text, bold_prefix=None, space_after=6, italic=False):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(space_after)
    
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Arial"
        r_pre.font.size = Pt(10.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(15, 23, 42)
        
    r = p.add_run(text)
    r.font.name = "Arial"
    r.font.size = Pt(10.5)
    r.font.italic = italic
    r.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_bullet(doc, bold_title, text):
    p = doc.add_paragraph(style='List Bullet')
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(4)
    
    r_title = p.add_run(bold_title + " ")
    r_title.font.name = "Arial"
    r_title.font.size = Pt(10)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(11, 90, 140)
    
    r_text = p.add_run(text)
    r_text.font.name = "Arial"
    r_text.font.size = Pt(10)
    r_text.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Arial"
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = RGBColor(7, 90, 140) # #075a8c
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Arial"
    r.font.size = Pt(12.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(11, 125, 194) # #0b7dc2
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Arial"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)
    return p

def format_table(tbl, col_widths, headers, data, alignments=None):
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    
    # Header row
    hdr_cells = tbl.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        hdr_cells[i].width = col_widths[i]
        set_cell_background(hdr_cells[i], "075A8C")
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Arial"
            run.font.size = Pt(9.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            
    # Data rows
    for r_idx, row_data in enumerate(data):
        row = tbl.rows[r_idx + 1]
        bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            cell.text = str(val)
            cell.width = col_widths[c_idx]
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
            p = cell.paragraphs[0]
            align = alignments[c_idx] if alignments else WD_ALIGN_PARAGRAPH.LEFT
            p.alignment = align
            for run in p.runs:
                run.font.name = "Arial"
                run.font.size = Pt(9)
                run.font.color.rgb = RGBColor(30, 41, 59)

def create_document():
    doc = docx.Document()
    
    # Configurar Márgenes (2.5 cm en todos los lados = ~1417 dxa = ~0.984 inches)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
        # Header / Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("GPdeS 2026 · TP Nº 02: Aprobación, Diagnóstico y Viabilidad | El Agüitas")
        hrun.font.name = "Arial"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Gestión de Proyectos de Software — San Rafael, Mendoza")
        frun.font.name = "Arial"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(148, 163, 184)

    # ==========================================
    # PORTADA / ENCABEZADO INSTITUCIONAL
    # ==========================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    r_inst = p_inst.add_run("GESTIÓN DE PROYECTOS DE SOFTWARE (GPdeS) — CICLO LECTIVO 2026")
    r_inst.font.name = "Arial"
    r_inst.font.size = Pt(11)
    r_inst.font.bold = True
    r_inst.font.color.rgb = RGBColor(7, 90, 140)

    p_tp = doc.add_paragraph()
    p_tp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tp.paragraph_format.space_after = Pt(14)
    r_tp = p_tp.add_run("TRABAJO PRÁCTICO Nº 02\nPropuesta de Proyecto de Software: Diagnóstico, Viabilidad y Aprobación")
    r_tp.font.name = "Arial"
    r_tp.font.size = Pt(13)
    r_tp.font.bold = True
    r_tp.font.color.rgb = RGBColor(15, 23, 42)

    # Cuadro de datos del proyecto y autores
    tbl_meta = doc.add_table(rows=4, cols=2)
    tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_meta.autofit = False
    meta_widths = [Inches(2.2), Inches(4.3)]
    
    meta_data = [
        ("Proyecto de Software:", "El Agüitas — Ecosistema Digital y Logística de Distribución de Agua"),
        ("Área de Aplicación / Región:", "Distribución de agua de mesa, dispensers y retornables en San Rafael, Mendoza"),
        ("Equipo de Desarrollo:", "Hugo Olguín · Agustín Carbajal · Arián Luszczak"),
        ("Estado de la Propuesta:", "Etapa de Aprobación Formal, Análisis de Factibilidad y Planificación Base")
    ]
    
    for i, (k, v) in enumerate(meta_data):
        row = tbl_meta.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width, c1.width = meta_widths[0], meta_widths[1]
        c0.text, c1.text = k, v
        set_cell_background(c0, "EAF4FB")
        set_cell_background(c1, "F8FAFC")
        set_cell_margins(c0, top=70, bottom=70, left=100, right=100)
        set_cell_margins(c1, top=70, bottom=70, left=100, right=100)
        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p0.runs[0].font.name = "Arial"
        p0.runs[0].font.size = Pt(9.5)
        p0.runs[0].font.bold = True
        p0.runs[0].font.color.rgb = RGBColor(7, 90, 140)
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p1.runs[0].font.name = "Arial"
        p1.runs[0].font.size = Pt(9.5)
        p1.runs[0].font.bold = (i == 0 or i == 2)
        p1.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Callout introductorio
    add_callout(
        doc,
        "El presente informe formaliza el Trabajo Práctico Nº 02 de la cátedra Gestión de Proyectos de Software. "
        "Se desarrollan en profundidad las tres etapas cardinales de la fase inicial de ingeniería: (1) Diagnóstico y "
        "Conceptualización del Negocio, (2) Análisis Integral de Viabilidad (Técnica, Económica, Tecnológica, de Recursos, "
        "Riesgos y Plazos), y (3) Fundamentación de los Motivos de Aprobación para la puesta en marcha definitiva.",
        "PROPUESTA FORMAL DE PROYECTO — EL AGÜITAS"
    )

    # =========================================================================
    # SECCIÓN 1: RECOPILACIÓN DE INFORMACIÓN: DIAGNÓSTICO Y CONCEPTUALIZACIÓN
    # =========================================================================
    add_heading_1(doc, "1. Recopilación de Información: Diagnóstico y Conceptualización")
    
    # 1.1 Situación de Negocio
    add_heading_2(doc, "1.1 Identificación y Documentación de la Situación de Negocio")
    add_p(
        doc,
        "El proyecto se origina en la necesidad operativa y comercial de la empresa distribuidora de agua de mesa purificada "
        "y equipamiento dosificador «El Agüitas», radicada en el departamento de San Rafael, Provincia de Mendoza. "
        "La empresa se dedica a la venta minorista y corporativa de bidones de agua purificada por ósmosis inversa (formatos 20L y 12L "
        "retornables, bidones descartables con manija, y packs comerciales), así como a la provisión, instalación y mantenimiento "
        "de dispensadores de pie frío/calor, dispensadores naturales y bombas dosificadoras recargables por USB."
    )
    add_p(
        doc,
        "Proceso Actual de Operación:",
        bold_prefix="Diagnóstico del Proceso Vigente: "
    )
    add_bullet(
        doc,
        "Recepción Descentralizada e Informal de Pedidos:",
        "Los pedidos de recarga de bidones y nuevos productos ingresan por canales no estructurados, fundamentalmente "
        "mensajes de WhatsApp directos a números personales de choferes o al teléfono de planta, llamadas de voz espontáneas "
        "y notas en papel. Esto genera pérdidas de pedidos, pedidos duplicados y falta de confirmación fehaciente al usuario."
    )
    add_bullet(
        doc,
        "Planificación Manual de Reparto y Logística Subóptima:",
        "La confección de la hoja de ruta diaria queda al criterio intuitivo de cada chofer, sin un ordenamiento geoespacial "
        "ni optimización por zonas horarias. Esto provoca trayectos redundantes por la geografía urbana y suburbana de San Rafael, "
        "elevado e ineficiente consumo de combustible, demoras en las ventanas horarias de entrega y desgaste prematuro de la flota."
    )
    add_bullet(
        doc,
        "Falta de Trazabilidad Crítica en Envases Retornables:",
        "El activo capital más sensible de la embotelladora son los botellones de policarbonato retornables de 20 litros y 12 litros. "
        "Actualmente, la cantidad de envases entregados vs. vacíos recuperados se anota manualmente o se omite en la vorágine de la entrega, "
        "generando una brecha de pérdida de envases estimada en un 12% mensual del stock en calle, lo que obliga a la empresa a realizar "
        "costosas reinversiones periódicas en reposición de plástico virgen."
    )
    add_bullet(
        doc,
        "Rendición de Cobranzas y Arqueo Diario Vulnerable:",
        "El chofer cobra en efectivo o mediante comprobantes aislados de transferencias bancarias enviadas a destiempo. "
        "Al finalizar la jornada laboral, la conciliación entre los bidones salidos del depósito, los bidones entregados, los vacíos "
        "recuperados y el dinero en efectivo genera diferencias de caja cotidianas y fricciones operativas entre choferes y administración."
    )
    add_p(
        doc,
        "Impacto en la Productividad y el Cliente: Esta precariedad organizativa frena la capacidad de escalar hacia nuevas zonas "
        "(como distritos aledaños de Rama Caída, Cuadro Benegas o Las Paredes), reduce el margen neto de ganancia por costos logísticos "
        "descontrolados y menoscaba la percepción de calidad y puntualidad del servicio frente a una clientela que exige inmediatez y certezas."
    )

    # 1.2 Necesidad u Oportunidad de Mejora
    add_heading_2(doc, "1.2 Necesidad u Oportunidad de Mejora en el Contexto Tecnológico")
    add_p(
        doc,
        "Necesidad Operativa Ineludible:",
        bold_prefix="Definición de la Necesidad: "
    )
    add_p(
        doc,
        "La necesidad primordial radica en erradicar la intermediación informal en la captura del pedido, blindar el balance patrimonial "
        "de envases retornables en poder de cada cliente y automatizar la rendición de caja de los repartidores mediante una herramienta "
        "accesible desde cualquier smartphone estándar en la calle."
    )
    add_p(
        doc,
        "Oportunidad Estratégica Tecnológica:",
        bold_prefix="Definición de la Oportunidad: "
    )
    add_p(
        doc,
        "Existe la oportunidad concreta de transformar a El Agüitas en la primera distribuidora de agua purificada de la región sur de Mendoza "
        "con una plataforma omnicanal Progressive Web App (PWA) de diseño Mobile-First. Aprovechando que tanto los clientes domiciliarios como "
        "los choferes ya cuentan con smartphones con conectividad móvil 4G, es posible suprimir la barrera de descarga e instalación forzosa de "
        "tiendas (Google Play / App Store) permitiendo el acceso instantáneo vía navegador o acceso directo en pantalla de inicio."
    )
    add_p(
        doc,
        "Contexto Tecnológico Actual de la Organización:",
        bold_prefix="Diagnóstico Tecnológico Preexistente: "
    )
    add_p(
        doc,
        "La organización cuenta con conectividad a Internet de banda ancha por fibra óptica en su planta central, terminales PC estándar "
        "en administración y choferes con dispositivos móviles Android con planes de datos personales y comerciales. No disponen de servidores "
        "propios on-premise ni personal interno de mantenimiento informático, lo que convierte a las tecnologías Serverless en la nube "
        "(Cloud Computing elástico) en la solución arquitectónica idónea por su costo marginal nulo en reposo y mantenimiento cero."
    )

    # 1.3 Descripción del Proyecto de Software
    add_heading_2(doc, "1.3 Descripción de las Características del Proyecto de Software")
    add_p(
        doc,
        "El sistema informático «El Agüitas» es una plataforma de software integral multiplataforma concebida bajo la filosofía Mobile-First "
        "y arquitectura desacoplada Frontend/Backend (JAMstack / Serverless Architecture)."
    )
    add_bullet(
        doc,
        "Tipo de Aplicación:",
        "Aplicación Web Progresiva (PWA) y Responsiva de alto rendimiento, optimizada ergonómicamente para pantallas táctiles de "
        "smartphones (touch targets mayores a 48px, navegación por barra inferior móvil) y adaptable de forma fluida a computadoras de escritorio."
    )
    add_bullet(
        doc,
        "Módulos y Funcionalidades Clave:",
        "\n• Portal Cliente: Catálogo interactivo con fotografía real de productos y accesorios, carrito de compras con control de stock, "
        "gestión de direcciones de entrega, selección de método de pago (efectivo al recibir o transferencia inmediata con alias/QR), "
        "seguimiento del estado del pedido en vivo y consulta del saldo de envases retornables en comodato.\n"
        "• Módulo Operativo de Chofer (Driver App): Panel de control en ruta optimizado para uso con una sola mano, listado de entregas "
        "asignadas con georreferenciación, botón de contacto y apertura de GPS (Google Maps / Waze), registro instantáneo de bidones vacíos "
        "retirados, cobro de dinero y cierre de hoja de ruta con rendición de caja balanceada.\n"
        "• Consola de Administración (Admin Dashboard): Panel de mando central con métricas en tiempo real, supervisión de pedidos por estado "
        "(Pendiente, En Preparación, En Reparto, Entregado, Cancelado), reasignación de choferes, gestión de catálogo de productos y precios, "
        "control de inventario de botellones llenos y auditoría de comodatos por cliente."
    )
    add_bullet(
        doc,
        "Perfiles y Roles de Usuario Previstos:",
        "1. Cliente Domiciliario / Corporativo: Autenticación segura vía JWT, alta de pedidos y control de suscripciones.\n"
        "2. Chofer / Repartidor: Visualización exclusiva de su ruta del día y liquidación en calle.\n"
        "3. Administrador / Operador de Planta: Control total del negocio, stock, métricas y usuarios."
    )
    add_bullet(
        doc,
        "Tecnologías Previstas e Implementadas:",
        "• Frontend: React 18, Vite, React Router 7, Vanilla CSS con Design System estructurado por tokens semánticos (paleta glaciar profesional, "
        "elevación por sombras estratificadas, cero componentes genéricos).\n"
        "• Backend & API: Node.js con Express, expuesto mediante Vercel Serverless Functions para escalabilidad automática y alta disponibilidad.\n"
        "• Base de Datos: PostgreSQL relacional alojado en la nube de Supabase (AWS us-east-2), gestionado mediante Connection Pooling (PgBouncer) "
        "para soportar picos concurrentes de pedidos y telemetría de choferes sin degradación de latencia."
    )

    # 1.4 Objetivos Generales y Alcance
    add_heading_2(doc, "1.4 Objetivos Generales y Alcance del Proyecto")
    add_p(
        doc,
        "Objetivo General del Proyecto:",
        bold_prefix="Objetivo General: "
    )
    add_p(
        doc,
        "Diseñar, desarrollar e implementar un ecosistema digital integral (web y móvil) que automatice la toma de pedidos, "
        "optimice la logística de distribución de agua purificada en San Rafael y garantice la trazabilidad total del stock "
        "de envases retornables y las cobranzas en calle, incrementando la rentabilidad operativa y la satisfacción del cliente final."
    )
    add_p(
        doc,
        "Objetivos Específicos:",
        bold_prefix="Objetivos Específicos (Metas Concretas): "
    )
    add_bullet(
        doc,
        "1. Automatización del Canal Comercial:",
        "Canalizar al menos el 80% de los pedidos recurrentes a través de la plataforma web/PWA en los primeros 60 días de operación, "
        "eliminando la pérdida de información y reduciendo los tiempos de atención telefónica en un 70%."
    )
    add_bullet(
        doc,
        "2. Eficiencia Logística y Reducción de Costos:",
        "Reducir en un 25% los kilómetros recorridos por entrega mediante la consolidación y secuenciación de rutas por zonas, "
        "disminuyendo el gasto directo de combustible vehicular y el tiempo muerto de los choferes."
    )
    add_bullet(
        doc,
        "3. Control Patrimonial de Envases Retornables:",
        "Lograr un índice de recupero y trazabilidad de botellones vacíos superior al 98%, reflejando en tiempo real el saldo de envases "
        "en la cuenta de cada cliente y en la carga de cada vehículo repartidor."
    )
    add_bullet(
        doc,
        "4. Transparencia y Rendición de Caja Cero Diferencias:",
        "Permitir la conciliación automática entre bidones entregados, dinero cobrado (efectivo y transferencias) y stock remanente "
        "al instante en que el chofer finaliza su jornada."
    )
    add_p(
        doc,
        "Límites y Alcance del Proyecto:",
        bold_prefix="Delimitación del Alcance (Scope Management): "
    )
    
    # Tabla de Alcance (In Scope vs Out of Scope)
    tbl_scope = doc.add_table(rows=7, cols=2)
    col_w_scope = [Inches(3.25), Inches(3.25)]
    scope_headers = ["ELEMENTOS INCLUIDOS (IN SCOPE)", "FUERA DE ALCANCE - FASE 1 (OUT OF SCOPE)"]
    scope_data = [
        ("Módulo responsive para clientes con catálogo interactivo y fotos reales de estudio.", "Pasarelas de cobro con tarjeta con comisiones leoninas y acreditación diferida (a pedido del negocio)."),
        ("Carrito de compras con persistencia de sesión y control de stock en tiempo real.", "Facturación electrónica fiscal automática AFIP/ARCA (se emite por el sistema contable actual)."),
        ("Módulo chofer Mobile-First con lista de entregas, geolocalización y registro de vacíos.", "Seguimiento satelital de vehículos por hardware GPS/IoT instalado en motores de camiones."),
        ("Panel administrativo con métricas de ventas, asignación de choferes y control de catálogo.", "Sistemas de contabilidad general, liquidación de sueldos o recursos humanos corporativos."),
        ("Cobro flexible: Efectivo contra entrega y transferencia inmediata por Alias/QR.", "Venta y distribución mayorista interprovincial fuera de San Rafael y zonas aledañas."),
        ("Control de stock relacional en PostgreSQL con transacciones atómicas seguras.", "Aplicación nativa compilada para tiendas cerradas que exijan comisiones de publicación.")
    ]
    format_table(tbl_scope, col_w_scope, scope_headers, scope_data)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # =========================================================================
    # SECCIÓN 2: VIABILIDAD, ANÁLISIS GENERAL
    # =========================================================================
    add_heading_1(doc, "2. Viabilidad y Análisis General")

    # 2.1 Viabilidad Técnica y Económica
    add_heading_2(doc, "2.1 Viabilidad Técnica y Económica")
    add_p(
        doc,
        "Viabilidad Técnica:",
        bold_prefix="Factibilidad Técnica: "
    )
    add_p(
        doc,
        "La solución se apoya en un stack de tecnologías ampliamente consolidadas y estandarizadas en la industria del software. "
        "El uso de React 18 con Vite proporciona una velocidad de carga instantánea (<1.2s First Contentful Paint) incluso en conexiones "
        "móviles 3G/4G inestables. La capa de datos se sustenta en PostgreSQL 15 sobre Supabase, garantizando integridad referencial "
        "estricta (Foreign Keys, Constraints de stock no negativo y transacciones ACID). La arquitectura Serverless en Vercel elimina "
        "el riesgo de caídas por sobrecarga, asegura un 99.9% de uptime garantizado por SLA y no demanda tareas complejas de administración "
        "de infraestructura (SysAdmin). El equipo de desarrollo cuenta con el dominio técnico integral de todas las librerías empleadas."
    )
    add_p(
        doc,
        "Viabilidad Económica:",
        bold_prefix="Factibilidad Económica y Financiera: "
    )
    add_p(
        doc,
        "El proyecto exhibe una rentabilidad económica excepcional. Al optar por servicios Cloud de última generación con capas gratuitas "
        "y costos escalables basados en consumo (Vercel Serverless + Supabase Cloud + dominio .com.ar oficial), el costo operativo fijo "
        "mensual para la distribuidora es inferior al valor de 15 bidones de agua de 20 litros. Con el ahorro estimado en combustible "
        "y la recuperación de apenas 10 envases retornables al mes que antes se daban por perdidos, el sistema cubre con creces su "
        "mantenimiento, ofreciendo un Retorno de Inversión (ROI) positivo desde el primer mes de despliegue."
    )

    # 2.2 Estimación de Objetivos Principales y 2.3 Cualificación de la Oportunidad
    add_heading_2(doc, "2.2 Estimación de Objetivos Principales y 2.3 Cualificación de la Oportunidad")
    add_p(
        doc,
        "La puesta en producción del ecosistema «El Agüitas» generará transformaciones medibles en todas las áreas operativas. "
        "A continuación, se cualifican las mejoras y beneficios esperados frente a los objetivos principales planteados:"
    )

    tbl_opp = doc.add_table(rows=5, cols=3)
    col_w_opp = [Inches(1.8), Inches(2.7), Inches(2.0)]
    opp_headers = ["OBJETIVO PRINCIPAL", "MEJORAS Y BENEFICIOS ESPERADOS", "RESULTADO ESPERADO"]
    opp_data = [
        ("Disociación y Centralización de Pedidos", "Eliminación de la pérdida de mensajes de WhatsApp y llamadas en espera. Registro estructurado del pedido con dirección exacta y horario preferido.", "100% de pedidos registrados sin omisiones ni confusiones."),
        ("Optimización Logística de Reparto", "Rutas agrupadas por cercanía geográfica en San Rafael. El chofer recibe en su móvil la secuencia exacta de entregas ordenadas.", "25% menos consumo de nafta; 30% más bidones entregados/hora."),
        ("Trazabilidad Total de Envases", "Cada entrega registra con un toque los bidones llenos entregados y los vacíos recuperados. Alerta de clientes con envases adeudados.", "Reducción de pérdida de botellones del 12% al <1.5% anual."),
        ("Transparencia en Cobranzas y Arqueo", "El sistema desglosa los cobros en efectivo y transferencias verificadas. Al finalizar la ruta, el saldo de caja coincide con el inventario.", "Diferencias de caja reducidas a $0 al cierre de turno.")
    ]
    format_table(tbl_opp, col_w_opp, opp_headers, opp_data)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 2.4 Evaluación Inicial de la Tecnología Disponible
    add_heading_2(doc, "2.4 Evaluación Inicial de la Tecnología Disponible")
    add_bullet(
        doc,
        "Hardware y Conectividad Existente:",
        "La empresa posee servicio de Internet de alta velocidad en la planta de envasado, dos computadoras de escritorio en el área "
        "administrativa con sistema operativo Windows y navegadores modernos actualizados (Google Chrome / Edge), y teléfonos celulares "
        "smartphones de gama media en poder de los tres repartidores de la flota."
    )
    add_bullet(
        doc,
        "Infraestructura Cloud Reutilizable:",
        "Se dispone de cuentas operativas configuradas para el proyecto en GitHub (gestión de repositorios y control de versiones), "
        "Vercel (plataforma de despliegue continuo y CDN global) y Supabase (instancia de PostgreSQL gestionada en AWS us-east-2)."
    )

    # 2.5 Evaluación de Tecnología a Adquirir y Recursos Humanos
    add_heading_2(doc, "2.5 Evaluación Inicial de Tecnología a Adquirir y Recursos Humanos")
    add_p(
        doc,
        "Tecnología e Infraestructura a Adquirir / Contratar:",
        bold_prefix="Componentes a Adquirir: "
    )
    add_bullet(
        doc,
        "Dominio Oficial de Marca:",
        "Registro de titularidad del dominio argentino .com.ar ante NIC Argentina (ej. elaguitas.com.ar) para dotar de presencia "
        "institucional, soberanía digital y confianza comercial."
    )
    add_bullet(
        doc,
        "Certificados SSL/TLS y Servicios Cloud:",
        "Aprovisionamiento de certificados SSL automáticos con cifrado de 256 bits (bonificados dentro de Vercel/Cloudflare) y plan "
        "de base de datos cloud con respaldo diario automatizado para garantizar continuidad de negocio."
    )
    add_p(
        doc,
        "Recursos Humanos y Roles del Equipo:",
        bold_prefix="Asignación de Capital Humano: "
    )
    add_p(
        doc,
        "El desarrollo, implantación y soporte está a cargo del equipo de ingenieros compuesto por Hugo Olguín, Agustín Carbajal "
        "y Arián Luszczak, quienes asumen de forma articulada los siguientes roles clave:"
    )
    add_bullet(
        doc,
        "Hugo Olguín (Lead Architecture & Backend Engineer):",
        "Diseño de la base de datos relacional PostgreSQL, modelado de esquemas, endpoints API REST, seguridad JWT y lógica de transacciones."
    )
    add_bullet(
        doc,
        "Agustín Carbajal (Fullstack & Logistics Optimization):",
        "Integración del módulo de choferes, optimización de hojas de ruta, geolocalización, sincronización de estados y pruebas de carga."
    )
    add_bullet(
        doc,
        "Arián Luszczak (Mobile-First UI/UX & Frontend Lead):",
        "Diseño del sistema visual, componentes táctiles ergonómicos, experiencia de checkout sin fricción, PWA y auditoría de accesibilidad."
    )

    # 2.6 Evaluación Inicial de Costo-Beneficio
    add_heading_2(doc, "2.6 Evaluación Inicial de Costo-Beneficio y Estructura Presupuestaria")
    add_p(
        doc,
        "Para responder a la realidad económica regional de San Rafael, se ha confeccionado una estructura presupuestaria transparente "
        "en Pesos Argentinos (ARS), desglosando los ítems de inversión de puesta en marcha frente a los costos operativos recurrentes:"
    )

    tbl_cost = doc.add_table(rows=7, cols=3)
    col_w_cost = [Inches(3.2), Inches(1.8), Inches(1.5)]
    cost_headers = ["CONCEPTO / ITEM DE COSTO", "PERIODICIDAD", "MONTO ESTIMADO (ARS)"]
    cost_data = [
        ("Registro de Dominio Oficial (.com.ar - NIC Argentina)", "Anual", "$ 12.000"),
        ("Infraestructura Cloud Serverless (Vercel Production)", "Mensual", "$ 18.000"),
        ("Base de Datos PostgreSQL Gestionada Cloud (Supabase)", "Mensual", "$ 22.000"),
        ("Certificado de Seguridad SSL/TLS (Cifrado militar 256-bit)", "Anual", "Bonificado ($ 0)"),
        ("Diseño, Desarrollo y Puesta en Marcha (Aporte Académico/Técnico)", "Única vez", "Bonificado ($ 0)"),
        ("Capacitación presencial a choferes y personal administrativo", "Única vez", "Incluido ($ 0)")
    ]
    format_table(tbl_cost, col_w_cost, cost_headers, cost_data, [WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.RIGHT])
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    add_p(
        doc,
        "Análisis de Retorno de la Inversión (Costo vs. Beneficio Tangible):",
        bold_prefix="Evaluación de Impacto Financiero: "
    )
    add_p(
        doc,
        "El costo operativo mensual consolidado de la plataforma asciende a aproximadamente $40.000 ARS. "
        "Frente a este costo marginal, los beneficios económicos inmediatos se cuantifican de la siguiente manera:\n"
        "• Ahorro de Combustible: Al optimizar los recorridos de los 3 móviles repartidores y evitar kilómetros redundantes, se estima "
        "un ahorro conservador de 60 litros de nafta mensuales por vehículo, totalizando más de $200.000 ARS de ahorro directo en combustible.\n"
        "• Recupero de Envases Retornables: Un botellón de 20L nuevo tiene un costo de reposición en plaza de $7.500 ARS. Evitar el extravío "
        "de tan solo 15 envases mensuales mediante el balance digitalizado en cuenta representa un ahorro patrimonial de $112.500 ARS mensuales.\n"
        "• Conclusión Costo-Beneficio: El proyecto genera un beneficio neto mensual superior a $270.000 ARS, demostrando un ratio Costo/Beneficio "
        "altamente favorable de 1 a 6.8 a favor de la empresa."
    )

    # 2.7 Identificación de Riesgos y Mitigación
    add_heading_2(doc, "2.7 Identificación de Riesgos y Matriz de Mitigación")
    add_p(
        doc,
        "Se aplicó la metodología de gestión de riesgos para anticipar potenciales obstáculos durante el ciclo de vida del proyecto:"
    )

    tbl_risk = doc.add_table(rows=5, cols=4)
    col_w_risk = [Inches(1.8), Inches(1.1), Inches(1.8), Inches(1.8)]
    risk_headers = ["RIESGO IDENTIFICADO", "PROBABILIDAD / IMPACTO", "EFECTO EN EL PROYECTO", "ESTRATEGIA DE MITIGACIÓN"]
    risk_data = [
        ("Resistencia al cambio por parte de los choferes acostumbrados al papel.", "Media / Alto", "Retraso en la carga de datos y registros incompletos de botellones vacíos.", "Diseño Mobile-First ultraliviano con botones gigantes (48px+) y flujo de 1 solo clic para confirmar entregas. Capacitación in-situ de 30 minutos."),
        ("Zonas rurales con baja o nula cobertura celular 4G en San Rafael.", "Media / Medio", "Imposibilidad momentánea de sincronizar el estado del pedido.", "Implementación de arquitectura Offline-First en la PWA mediante Service Workers y LocalStorage; los datos se sincronizan al recuperar señal."),
        ("Variación de costos en servicios cloud por fluctuación cambiaria.", "Baja / Bajo", "Incremento en las tarifas de hosting y bases de datos.", "Aprovechamiento de la capa elástica gratuita/hobby de Vercel y Supabase, optimizando consultas para no superar cuotas mínimas."),
        ("Retrasos por modificaciones o agregados de requerimientos en desarrollo.", "Media / Medio", "Desvío del cronograma pactado para la etapa de puesta en marcha.", "Adopción de metodología ágil Scrum con sprints semanales fijos y alcance cerrado (definición estricta de In-Scope y Out-of-Scope).")
    ]
    format_table(tbl_risk, col_w_risk, risk_headers, risk_data)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 2.8 Objetivos Particulares del Proyecto
    add_heading_2(doc, "2.8 Objetivos Particulares por Etapas, Procesos y Áreas")
    add_bullet(
        doc,
        "Área Comercial y de Atención al Cliente:",
        "Implementar un catálogo digital accesible 24/7 con fotos reales de alta fidelidad, sistema de carrito y checkout ágil que permita "
        "completar un pedido en menos de 45 segundos sin necesidad de interacción humana previa."
    )
    add_bullet(
        doc,
        "Área de Logística y Despacho:",
        "Digitalizar el 100% de las hojas de ruta de los choferes, permitiendo la asignación dinámica de pedidos según cercanía y la confirmación "
        "instantánea de entrega con georreferenciación."
    )
    add_bullet(
        doc,
        "Área de Depósito y Control de Stock:",
        "Automatizar el balance de entradas y salidas de botellones cargados y envases vacíos, emitiendo alertas tempranas de stock mínimo "
        "para el proceso de envasado y purificación."
    )
    add_bullet(
        doc,
        "Área de Administración y Finanzas:",
        "Alcanzar la conciliación diaria exacta entre las ventas facturadas, los pagos recibidos (efectivo y billeteras virtuales) y la recaudación "
        "física rendida por los choferes al finalizar cada turno."
    )

    # 2.9 Evaluación Inicial de Tiempos
    add_heading_2(doc, "2.9 Evaluación Inicial de Tiempos y Cronograma de Ejecución")
    add_p(
        doc,
        "El proyecto se estructura en cuatro fases secuenciales e iterativas bajo metodología Scrum, con una duración total de 8 semanas:"
    )

    tbl_time = doc.add_table(rows=5, cols=3)
    col_w_time = [Inches(1.8), Inches(3.2), Inches(1.5)]
    time_headers = ["FASE / ETAPA", "ACTIVIDADES PRINCIPALES Y ENTREGABLES", "DURACIÓN ESTIMADA"]
    time_data = [
        ("Fase 1: Diagnóstico e Inmersión", "Relevamiento in-situ de procesos en planta, toma de requerimientos, diseño de arquitectura de datos PostgreSQL y prototipado UX/UI en Figma.", "Semanas 1 y 2 (14 días)"),
        ("Fase 2: Construcción del Núcleo", "Desarrollo del Backend API REST en Node.js, conexión Supabase, desarrollo del Frontend React y módulo de catálogo y checkout.", "Semanas 3 a 5 (21 días)"),
        ("Fase 3: Módulo Chofer y Pruebas", "Implementación de la aplicación móvil de choferes, registro de envases retornables, optimización de rutas y pruebas de campo con vehículos reales.", "Semanas 6 y 7 (14 días)"),
        ("Fase 4: Despliegue y Capacitación", "Puesta en producción en Vercel, configuración de dominio definitivo, capacitación al personal administrativo y choferes, y monitoreo inicial.", "Semana 8 (7 días)")
    ]
    format_table(tbl_time, col_w_time, time_headers, time_data, [WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER])
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # =========================================================================
    # SECCIÓN 3: APROBACIÓN
    # =========================================================================
    add_heading_1(doc, "3. Aprobación del Proyecto")
    add_heading_2(doc, "3.1 Motivos Fundamentados para la Aprobación Formal del Proyecto")
    add_p(
        doc,
        "En cumplimiento de los requerimientos de la cátedra para la etapa de Aprobación, se exponen de forma categórica los fundamentos "
        "técnicos, económicos y estratégicos que justifican la aprobación definitiva y la asignación de recursos para la puesta en marcha "
        "del proyecto de software «El Agüitas»:"
    )

    add_bullet(
        doc,
        "1. Necesidad Crítica e Impostergable (¿Por qué ahora?):",
        "El modelo de gestión informal basado en WhatsApp y planillas de papel ha llegado a su techo operativo. Continuar operando sin "
        "un sistema digitalizado condena a la empresa a un sobrecosto logístico creciente por el aumento constante de combustibles, una "
        "pérdida irrecuperable de botellones vacíos (más de 15 unidades mensuales) y la incapacidad de expandirse a nuevos distritos de San Rafael. "
        "Postergar el proyecto significaría ceder cuota de mercado frente a competidores que comiencen a tecnificarse."
    )
    add_bullet(
        doc,
        "2. Beneficios Tangibles e Intangibles Comprobados:",
        "En el plano tangible, el sistema genera ahorros inmediatos superiores a $270.000 ARS mensuales en combustible y reposición de envases, "
        "con una inversión mensual fija de apenas $40.000 ARS. En el plano intangible, la empresa profesionaliza su imagen de marca, "
        "otorga certezas de entrega al vecino de San Rafael, elimina el estrés y las disputas diarias en los arqueos de caja con los choferes "
        "y sienta las bases para una relación comercial de largo plazo con clientes corporativos y familiares."
    )
    add_bullet(
        doc,
        "3. Viabilidad Tecnológica Absoluta y Cero Riesgo de Infraestructura:",
        "No se requieren inversiones de capital (CAPEX) en servidores locales costosos ni licencias privativas. La arquitectura Serverless "
        "utiliza estándares de código abierto (React, Node.js, PostgreSQL) sobre proveedores de nube de clase mundial (Vercel, Supabase), "
        "asegurando disponibilidad del 99.9% y escalabilidad ilimitada sin costes fijos asfixiantes."
    )
    add_bullet(
        doc,
        "4. Alineación Estratégica con la Transformación Digital Local:",
        "El proyecto coloca a El Agüitas a la vanguardia tecnológica del rubro de servicios esenciales en Cuyo, posicionando a la firma "
        "como un referente de eficiencia, transparencia bromatológica y puntualidad operativa, fortaleciendo el desarrollo productivo "
        "regional de San Rafael."
    )
    add_bullet(
        doc,
        "5. Control Riguroso de Riesgos y Continuidad Operativa:",
        "Los riesgos inherentes a conectividad en zonas rurales y resistencia al cambio fueron mitigados mediante el diseño Mobile-First "
        "extremadamente intuitivo y la capacidad de operación sin conexión (Offline-First). El plan asegura que la actividad comercial "
        "nunca se detenga durante el proceso de transición."
    )

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # Dictamen formal de Aprobación
    add_callout(
        doc,
        "DICTAMEN DE LA DIRECCIÓN Y EQUIPO DE PROYECTO:\n"
        "Habiéndose acreditado de manera concluyente la viabilidad técnica, la conveniencia económico-financiera con un ROI ampliamente positivo, "
        "la disponibilidad del capital humano especializado y la existencia de un plan de mitigación eficaz para la totalidad de los riesgos "
        "identificados, SE RESUELVE DICTAMINAR LA APROBACIÓN FORMAL Y DEFINITIVA del Proyecto de Software «El Agüitas», autorizando el paso "
        "a la fase de ingeniería de detalle, desarrollo y despliegue operativo en el mercado de San Rafael, Mendoza.",
        "RESOLUCIÓN FINAL DE APROBACIÓN"
    )

    # Firma y cierre
    doc.add_paragraph().paragraph_format.space_before = Pt(24)
    tbl_sign = doc.add_table(rows=1, cols=3)
    tbl_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_sign.autofit = False
    sign_widths = [Inches(2.1), Inches(2.1), Inches(2.1)]
    
    signers = [
        ("Hugo Olguín", "Arquitectura & Backend"),
        ("Agustín Carbajal", "Logística & Optimización"),
        ("Arián Luszczak", "Frontend & Mobile UI/UX")
    ]
    
    for idx, (name, role) in enumerate(signers):
        c = tbl_sign.rows[0].cells[idx]
        c.width = sign_widths[idx]
        set_cell_background(c, "F8FAFC")
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        r1 = p.add_run("_________________________\n")
        r1.font.color.rgb = RGBColor(148, 163, 184)
        
        r2 = p.add_run(f"{name}\n")
        r2.font.name = "Arial"
        r2.font.size = Pt(10)
        r2.font.bold = True
        r2.font.color.rgb = RGBColor(7, 90, 140)
        
        r3 = p.add_run(role)
        r3.font.name = "Arial"
        r3.font.size = Pt(8.5)
        r3.font.italic = True
        r3.font.color.rgb = RGBColor(100, 116, 139)

    out_path = os.path.join("tp 2", "Proyecto_de_Software_TP02_El_Aguitas.docx")
    doc.save(out_path)
    print(f"Documento generado exitosamente en: {out_path}")

if __name__ == "__main__":
    create_document()
