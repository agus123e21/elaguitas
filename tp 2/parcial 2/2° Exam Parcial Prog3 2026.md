Tecnicatura Superior en Desarrollo de Software 

Programación III Segundo Examen Parcial 

## **PROGRAMACIÓN III - TSDS SEGUNDO EXAMEN PARCIAL** 

Desarrollo de un sistema web con PHP y MySQL - Modalidad: proyecto integrador con defensa oral 

# **<mark>1. Datos del grupo</mark>** 

|**Nombre del sistema**|
|---|
|**Integrantes**|
Hugo Olguin, Arian Luszczak, Agustin Carbajal, Pablo silva
|**(apellido y nombre / legajo)**|



El trabajo puede realizarse de forma **individual o en grupos de hasta 4 (cuatro) integrantes** . 

# **<mark>2. Objetivo</mark>** 

Diseñar, desarrollar y defender un sistema informático que responda al paradigma de la programación web del lado del servidor, utilizando el lenguaje **PHP** y un motor de base de datos **MySQL** . El sistema deberá integrar los saberes básicos de los espacios curriculares de primer, segundo y tercer año de la carrera en programación, base de datos, diseño de interfaces, etc. El sistema debe respetar la arquitectura clienteservidor: el lado del servidor se programará en PHP y el lado del cliente con HTML, CSS y JavaScript. 

# **<mark>3. Consigna general</mark>** 

El sistema deberá resolver un **problema concreto de la vida real** , integrando la gestión de sus datos con, al menos, un módulo que procese esos datos y produzca un resultado útil. Cada grupo elegirá un **dominio de problema real o simulado.** 

Por ejemplo: sistema comercial, gestión escolar, sistema de biblioteca, sistema de gestión de turnos, consultorios médicos, etc. 

# **<mark>4. Requerimientos funcionales</mark>** 

## **4.1. Módulos básicos (ABM/CRUD) - mínimo 3 tablas principales** 

El sistema debe implementar las operaciones completas de **alta, baja, modificación, consulta, búsqueda y listado** sobre al menos **tres tablas maestras o principales** (por ejemplo: clientes, productos, proveedores, alumnos, cursos, pacientes, etc.) 

- Cada módulo debe contar con formulario de carga, listado con opción de búsqueda/filtro, edición y eliminación (física o lógica mediante campo de estado, a criterio del grupo y debidamente justificado). 

- El grupo deberá **indicar cuáles son las tablas principales y justificar su elección** en función del dominio. 

- Las tablas deben estar relacionadas mediante claves primarias y foráneas cuando el dominio lo requiera. 

- El diseño de la base de datos deberá respetar el Modelo Entidad-Relación (MER) de Chen y el Modelo Relacional de Codd. 

1 

Tecnicatura Superior en Desarrollo de Software 

Programación III Segundo Examen Parcial 

## **4.2. Módulo integrador de procesamiento** 

El sistema debe incluir **al menos un módulo que procese datos e integre los módulos básicos** , generando información nueva a partir de ellos. 



Ejemplos orientativos: 

- Sistema comercial: módulo de **facturación o ventas** (cabecera y detalle, cálculo de totales, descuento de stock). 

- Sistema escolar: módulo de **inscripciones o calificaciones** con cálculo de promedios y condición del alumno. 

- Sistema de turnos: módulo de **reserva de turnos** con control de disponibilidad. 

Este módulo debe utilizar datos de, como mínimo, dos de las tablas principales, mostrar los resultados del procesamiento de forma clara y **conservar en la base de datos** la información necesaria para consultarlos posteriormente (tablas de cabecera/detalle o equivalentes). Debe incluir además **al menos un listado o reporte** que consulte esa información procesada. 

**El módulo integrador no se satisface con una simple pantalla de listado:** debe realizar un procesamiento concreto (cálculos, reglas de negocio, actualización de otras tablas). 

**Consistencia interna:** debe existir coherencia entre el proceso realizado y el estado de la base de datos. <u>Por ejemplo, en un sistema de biblioteca, si hay 5 ejemplares de un libro y se registra un préstamo, el</u> stock disponible debe quedar en 4; al registrar la devolución, debe volver a 5. Toda operación del módulo integrador que afecte otras tablas debe reflejarse correctamente en ellas. 

## **4.3. Autenticación y control de acceso** 

- Inicio y cierre de sesión mediante **sesiones de PHP** . 

- Tabla de usuarios con contraseñas almacenadas de forma segura ( `password_hash()` y `password_verify()` ). 

2 

Tecnicatura Superior en Desarrollo de Software 

Programación III Segundo Examen Parcial 

- Las secciones privadas del sistema no deben ser accesibles sin haber iniciado sesión. 

# **<mark>5. Requerimientos técnicos</mark>** 

|**Aspecto**|**Exigencia**|
|---|---|
|Lenguaje y servidor|PHP ejecutado en servidor web (Apache) y base de datos MySQL/MariaDB.|
|Interfaz|HTML semántico y CSS. JavaScript para validaciones del lado del cliente<br>(mínimo en los formularios principales). Diseño ordenado y usable.|
|Conexión a la BD|Archivo de conexión único y reutilizable (`conexion.php`o similar), incluido<br>con`include`/`require`.|
|Consultas|Uso obligatorio de**consultas parametrizadas (sentencias preparadas)**en<br>todas las operaciones que reciban datos del usuario.|
|Organización del código|Estructura modular de carpetas. Reutilización de componentes comunes<br>(encabezado, menú, pie, funciones, conexión). Código legible, indentado y<br>comentado.|
|Validaciones|Validación integral**cliente y servidor**en**todos los ingresos de datos**, de modo<br>de evitar anomalías o errores de carga en las tablas (campos obligatorios,<br>tipos, rangos, formatos, duplicados). Mensajes claros de confirmación y de<br>error.|
|Salida segura|Escapar los datos al mostrarlos en HTML (`htmlspecialchars()`). No<br>mostrar al usuario final errores técnicos ni credenciales de conexión.|
|Copias de seguridad|Funcionalidad que genere una copia de seguridad de la base de datos<br>mediante código PHP. (obligatoria)|



# **<mark>6. Pruebas y documentación</mark>** 

El grupo deberá elaborar un **documento en formato PDF** que contenga: 

1. Carátula con nombre del sistema e integrantes. 

2. **Problema y alcance:** descripción del problema que resuelve, usuarios del sistema, datos que administra y resultado esperado del módulo integrador. 

3. Modelo de datos: **diagrama entidad-relación** y descripción de las tablas (campos, tipos, claves), indicando cuáles son las tablas principales y por qué. 

4. Descripción de los módulos del sistema y del flujo del módulo integrador. 

5. **Instrucciones de instalación y ejecución** en entorno local (versión de PHP/MySQL, importación del .sql, configuración de la conexión, usuario de prueba). 

6. Capturas de pantalla de todas las pantallas principales funcionando. 

7. **Cuadro de casos de prueba** (mínimo 10) con **al menos un caso por cada operación CRUD y por el módulo integrador** , y que incluya además: carga, modificación, eliminación, búsqueda, autenticación 

3 

Tecnicatura Superior en Desarrollo de Software 

Programación III Segundo Examen Parcial 

correcta e incorrecta y cierre de sesión. Para cada caso: descripción, datos de entrada, resultado esperado, resultado obtenido y estado (OK / error). 

8. Registro de incidencias detectadas y cómo fueron corregidas. 

9. Distribución de tareas entre los integrantes. 

# **<mark>7. Entrega</mark>** 

Se subirá al campus virtual, **antes de la fecha y hora límite indicada por el docente** , un único archivo comprimido ( `.zip` ) nombrado como `Apellidos_Sistema_Parcial2.zip` que contenga: 

- La carpeta completa con el **código fuente** del sistema. 

- El archivo **.sql** con la exportación de la base de datos (estructura y **datos de prueba suficientes** para comprobar el funcionamiento del sistema, incluyendo un usuario de acceso y su contraseña indicada en el PDF). 

- El **documento PDF** descripto en la sección 6. 

Se entregará **un único sistema por grupo** , con los nombres de todos sus integrantes. Además de la entrega en el campus, cada grupo realizará una **demostración funcional** del sistema en la instancia que indique el docente. 

**Importante:** el sistema debe poder ponerse en funcionamiento en el equipo del docente siguiendo únicamente las instrucciones de instalación incluidas en el PDF. Un sistema que no ejecute no podrá ser evaluado en su parte funcional. 

# **<mark>8. Demostración y defensa individual</mark>** 

Si bien el sistema puede desarrollarse en grupo, **cada estudiante debe conocer y comprender la totalidad del código fuente** . Durante la defensa, el docente podrá solicitar a cualquier integrante que: 

- **Explique el flujo completo de una operación** del sistema (una operación CRUD, el procesamiento del módulo integrador, el inicio de sesión, etc.), desde el formulario hasta la base de datos. 

- **Identifique las consultas SQL y las validaciones** empleadas en esa operación, y explique qué hace cada una. 

- **Realice o justifique una modificación puntual** indicada por el docente (agregar un campo, cambiar una validación, ajustar una consulta o un cálculo, etc.). 

- Justifique las decisiones de diseño tomadas y las medidas de seguridad implementadas. 

**Aclaración:** la participación en un grupo **no implica una calificación idéntica** para todos sus integrantes. La calificación es individual. Un estudiante que no pueda explicar ni modificar el código del sistema presentado verá afectada su nota, pudiendo desaprobar aun cuando el trabajo grupal sea correcto. 

# **<mark>9. Criterios de evaluación</mark>** 

**Criterio Puntaje** 

4 

Tecnicatura Superior en Desarrollo de Software 

Programación III Segundo Examen Parcial 

|**Base de datos y modelo de datos:**MER, BD relacional, normalización, claves, relaciones,<br>script .sql funcional|10|
|---|---|
|**Módulos ABM/CRUD**(3 tablas principales): funcionamiento completo, búsqueda y<br>listados; justificación de las tablas elegidas|20|
|**Módulo integrador:**procesamiento, reglas de negocio, consistencia con la base de datos,<br>persistencia y reportes|20|
|**Seguridad y sesiones:**login/logout, hash de contraseñas, consultas parametrizadas,<br>control de acceso, validación cliente-servidor, copias de seguridad.|15|
|**Calidad del código e interfaz:**modularidad, reutilización, legibilidad, usabilidad|10|
|**Entrega, documentación y pruebas:**PDF completo, casos de prueba, demostración<br>funcional|5|
|**Defensa oral individual:**explicación y modificación del código|20|
|**TOTAL**|**100**|



Para aprobar se exige una calificación **no menor a 6 (seis), equivalente al 60%** , según la escala de calificación del espacio curricular. En caso de desaprobar, el estudiante podrá acceder a la instancia de recuperatorio conforme a lo establecido en la planificación. 

|**Escala de calificación**||
|---|---|
|0% - 15%: 1 (Uno)|Desaprobado|
|16% - 26%: 2 (Dos)|Desaprobado|
|27% - 37%: 3 (Tres)|Desaprobado|
|38% - 48%: 4 (Cuatro)|Desaprobado|
|49% - 59%: 5 (Cinco)|Desaprobado|
|60% - 65%: 6 (Seis)|Aprobado|
|66% - 76%: 7 (Siete)|Aprobado|
|77% - 85%: 8 (Ocho)|Aprobado|
|86% - 95%: 9 (Nueve)|Aprobado|
|96% - 100%: 10 (Diez)|Aprobado|



# **<mark>10. Condiciones generales</mark>** 

- El trabajo debe ser **original** . La copia total o parcial entre grupos, o de fuentes externas sin autoría propia, implicará la desaprobación de la instancia. 

5 

Tecnicatura Superior en Desarrollo de Software 

Programación III Segundo Examen Parcial 

- Se permite consultar la documentación oficial de PHP y MySQL y el material de la cátedra. El uso de herramientas de asistencia (incluida la inteligencia artificial) no exime al estudiante de comprender y poder defender cada línea del código presentado. 

- Se recomienda el uso de un repositorio Git para el control de versiones, como evidencia del trabajo de cada integrante. 

- La entrega fuera de término no será evaluada en esta instancia. 

- La fecha de entrega, la conformación de los grupos y las condiciones operativas de la defensa serán publicadas en el campus virtual del espacio curricular. 

### **FIN DEL EXAMEN PARCIAL** 

6 

