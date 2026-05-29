# KenetiX Single Product Page Work Summary

## ภาษาไทย

### ภาพรวมงาน

งานชุดนี้เพิ่มหน้า `Single Product Page` สำหรับโปรเจกต์ KenetiX ที่ path `/product` เพื่อแสดงรายละเอียดรองเท้าวิ่งหนึ่งรุ่นแบบพร้อมเช่า หน้าใหม่นี้ถูกออกแบบให้ใช้ธีมเดียวกับ KenetiX เดิม เช่นพื้นหลังดำ สี lime/aqua, navbar เดียวกัน, layout แบบ product detail และรองรับสองภาษา `EN / TH`

ตอนนี้ยังไม่เชื่อม backend ตาม scope งาน ข้อมูลสินค้าจึงเป็น mock data ภายใน component เพื่อให้ทีมเห็นโครงสร้าง UI และสามารถเปลี่ยนไปดึงข้อมูลจาก API ได้ภายหลัง

### ส่วนประกอบหลักที่เพิ่มหรือแก้

#### `src/componente/SingleProductPage.jsx`

เป็นหน้าหลักของ `/product`

ทำหน้าที่:
- แสดง breadcrumb, สถานะสินค้า, ชื่อแบรนด์ และชื่อรุ่น
- แสดงภาพสินค้าโดยใช้ asset โทนเดียวกับหน้า How It Works
- แสดงค่าเช่าและเงินประกัน
- ให้ผู้ใช้เลือกไซส์รองเท้า
- ให้ผู้ใช้เลือกแพ็กเกจเช่า
- ให้ผู้ใช้เลือกวันรับรองเท้าและวันคืนรองเท้า
- ให้ผู้ใช้เลือกวิธีรับรองเท้า เช่นรับหน้าร้านหรือจัดส่ง
- แสดงข้อมูลรองเท้า จุดเด่น และ rental assurance
- แสดง flow การเช่า 4 ขั้นตอน
- รองรับภาษาไทยและอังกฤษด้วย `useLanguage()`

วิธีทำ:
- ใช้ object `productCopy.th` และ `productCopy.en` เพื่อเก็บข้อความสองภาษา
- ใช้ React `useState` สำหรับสถานะที่ผู้ใช้เลือก เช่น size, rental plan และ delivery method
- ใช้ `useMemo` เพื่อเลือกข้อมูลแพ็กเกจปัจจุบันจาก state
- ใช้ Tailwind class ตาม theme เดิมของ KenetiX
- ใช้ layout responsive แบบสอง column บน desktop และเรียงลงบน mobile

#### `src/App.jsx`

เพิ่ม route แบบง่ายสำหรับหน้า product

สิ่งที่แก้:
- import `SingleProductPage`
- เพิ่มเงื่อนไข `currentPath === "/product"`
- เมื่อ path เป็น `/product` จะ render หน้า `SingleProductPage`

### ข้อมูลสินค้าในหน้านี้

ข้อมูลสินค้าเป็น mock data ชั่วคราว:
- Brand: Nike
- Model: Pegasus 41
- Rental fee: `฿290 / day`
- Deposit: `฿2,000`
- Sizes: `US 7` ถึง `US 12`
- Plans: Daily, Weekend, Weekly
- Delivery: Store pickup, Home delivery

ข้อมูลนี้ตั้งใจให้เป็น placeholder สำหรับ frontend ก่อนเชื่อม backend จริง

### สรุปคอมมิต

#### `feat(product): add single product page`

เพิ่มหน้า product detail หลัก

สิ่งที่ทำ:
- เพิ่ม `SingleProductPage.jsx`
- เพิ่ม route `/product`
- เพิ่ม UI สำหรับ product hero, price, deposit, size selector, rental plan, date inputs และ delivery selector
- เพิ่มส่วน shoe details, best for, rental assurance และ rental flow
- รองรับภาษาไทยและอังกฤษด้วย context เดิม

#### `docs(product): add single product work summary`

เพิ่มเอกสารสรุปงาน

สิ่งที่ทำ:
- สรุปภาพรวมหน้า Single Product Page
- อธิบายหน้าที่ของไฟล์ที่เพิ่มและแก้
- ระบุข้อมูล mock ที่ใช้
- อธิบาย commit ให้ทีมอ่านต่อได้ง่าย

### การตรวจสอบ

ใช้คำสั่งต่อไปนี้ตรวจหลังแก้งาน:

```bash
npm.cmd run lint
npm.cmd run build
```

### หมายเหตุสำหรับทีม

- หน้านี้ยังไม่เชื่อม backend ตาม scope งาน
- เมื่อ backend พร้อม สามารถแทน `productCopy` และข้อมูล mock ด้วย API response ได้
- Routing ตอนนี้ยังเป็น logic ง่ายใน `App.jsx`
- ถ้าโปรเจกต์มีหลาย product แนะนำเปลี่ยน path เป็น `/product/:id` พร้อมใช้ `react-router-dom`
- ข้อความไทยควรบันทึกไฟล์เป็น UTF-8 เสมอ

---

## English

### Work Overview

This work adds a `Single Product Page` for the KenetiX project at `/product`. The page presents one rentable running shoe in a full product detail layout. It follows the existing KenetiX visual direction with a black background, lime/aqua accents, the shared navbar, and bilingual `EN / TH` support.

The page is not connected to the backend yet, by request. Product data is currently local mock data inside the component so the team can review the UI structure first and connect API data later.

### Main Parts Added Or Updated

#### `src/componente/SingleProductPage.jsx`

This is the main page for `/product`

Responsibilities:
- Displays breadcrumb, availability status, brand, and model name
- Displays the product image using the existing KenetiX visual asset
- Displays rental fee and deposit
- Lets users select shoe size
- Lets users select a rental plan
- Lets users select pickup and return dates
- Lets users select pickup method such as store pickup or home delivery
- Displays shoe details, best-for notes, and rental assurance
- Displays a 4-step rental flow
- Supports Thai and English through `useLanguage()`

How it works:
- Stores bilingual content in `productCopy.th` and `productCopy.en`
- Uses React `useState` for selected size, rental plan, and delivery method
- Uses `useMemo` to derive the current selected rental plan
- Uses Tailwind classes that match the existing KenetiX theme
- Uses a responsive layout with two columns on desktop and stacked content on mobile

#### `src/App.jsx`

Adds simple route handling for the product page

Updates:
- Imports `SingleProductPage`
- Adds a `currentPath === "/product"` check
- Renders `SingleProductPage` when the path is `/product`

### Product Data In This Page

The product data is temporary mock data:
- Brand: Nike
- Model: Pegasus 41
- Rental fee: `฿290 / day`
- Deposit: `฿2,000`
- Sizes: `US 7` to `US 12`
- Plans: Daily, Weekend, Weekly
- Delivery: Store pickup, Home delivery

This is intended as a frontend placeholder before backend integration.

### Commit Summary

#### `feat(product): add single product page`

Adds the main product detail page

Changes:
- Adds `SingleProductPage.jsx`
- Adds the `/product` route
- Adds product hero, price, deposit, size selector, rental plan, date inputs, and delivery selector
- Adds shoe details, best-for notes, rental assurance, and rental flow sections
- Supports Thai and English with the existing language context

#### `docs(product): add single product work summary`

Adds the work summary document

Changes:
- Summarizes the Single Product Page work
- Explains the added and updated files
- Documents the mock product data
- Explains the commits for team review

### Verification

The work is checked with:

```bash
npm.cmd run lint
npm.cmd run build
```

### Notes For The Team

- This page is not connected to the backend yet by scope
- When the backend is ready, `productCopy` and mock data can be replaced with API response data
- Routing is still handled with simple logic in `App.jsx`
- If the project grows to multiple products, consider `/product/:id` with `react-router-dom`
- Thai text files should always be saved as UTF-8
