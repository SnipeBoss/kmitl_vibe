# Design — Frontend Design Standard

> มาตรฐานการออกแบบ UI ทุกหน้าจอ (มาจาก agent-skill SOP ขององค์กร) — **อ่านก่อนสร้างหรือแก้ UI ทุกครั้ง (binding)**

## เอกสารในหมวดนี้

| ลำดับ | เอกสาร | คำอธิบาย |
|:-----:|:-------|:---------|
| D.1 | [Style_Apple.md](Style_Apple.md) | Apple design style ฉบับเต็ม — photography-first layout, single Action Blue accent, SF Pro typography ladder, tile rhythm, one-shadow elevation, responsive breakpoints |
| D.2 | [Brand_Guideline.md](Brand_Guideline.md) | Brand tokens ที่ใช้จริงในโค้ด — สี, IBM Plex Sans typography, spacing/radius, breakpoints, กฎ component & accessibility, Tailwind mapping |

## ลำดับการอ่านแนะนำ

1. อ่าน **Style_Apple.md** ให้จบเพื่อเข้าใจภาษาการออกแบบ (layout rhythm, elevation, ปรัชญา whitespace)
2. อ่าน **Brand_Guideline.md** เพื่อรู้ token ที่ต้องใช้จริง — ห้ามคิดสี/ขนาด/spacing ใหม่เอง
3. ระหว่างทำงาน อ้าง token ตามชื่อ (`{colors.primary}`, `p-6`, `rounded-lg`) — never inline hex

## กฎ binding

- **อ่านทั้งสองไฟล์ก่อนสร้างหรือแก้ UI ใด ๆ ทุกครั้ง รวมถึงเมื่อกลับมาทำงาน UI ใน session ใหม่** — wireframe, design prompt, หรือ React component ก็ตาม
- UI ที่เริ่มทำโดยไม่ได้อ่าน = **ถูก reject ตอน review**
- Design gate (Gate 2) เช็คการ comply กับเอกสารทั้งสองนี้ — ดู checklist ใน [../iso-mapping.md](../iso-mapping.md)
