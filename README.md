# SnapCut AI

BUILD A COMPLETE FUNCTIONAL WEBSITE — SNAPCUT AI

You are a senior full-stack engineer, product architect, UI/UX designer, and AI integration engineer.

Build a complete, responsive, production-quality MVP web application called **SnapCut AI**.

Do NOT build only a landing-page mockup. The website must have a functional image-upload and AI background-removal workflow.

==================================================

1. PRODUCT

==================================================

Product Name:

SnapCut AI

Product Type:

AI-powered image background removal web application.

Main Problem:

Removing image backgrounds manually is time-consuming, difficult for beginners, and often requires expensive professional editing software.

Solution:

SnapCut AI allows users to upload an image and remove its background with one click using an AI background-removal API.

Target Users:

- E-commerce sellers

- Graphic designers

- Social media creators

- Students

- Marketers

- Small business owners

- Content creators

Core Value Proposition:

Upload an image → AI removes the background → preview the result → download a transparent PNG.

The MVP should focus on ONE core feature:

AI-powered one-click background removal.

==================================================

2. IMPORTANT BUSINESS CONSTRAINT

==================================================

This is a practice/MVP project.

DO NOT implement:

- Payment system

- Subscription system

- Premium plans

- Stripe

- Razorpay

- Checkout

- Payment webhooks

- Paid credits

- Billing dashboard

The application should be completely free for users.

Instead, control AI usage with a daily processing limit.

Usage limit:

- Maximum 5 successful background-removal processes per registered user per day.

- A successful AI background-removal operation counts as 1 usage.

- Invalid files do NOT count as usage.

- Failed AI processing does NOT count as usage.

- Downloading an already processed image does NOT count as usage.

- Uploading an image by itself does NOT count as usage.

- Only successful background removal counts as 1 usage.

Display the user's remaining usage clearly.

Example:

"3 / 5 images remaining today"

When the limit is reached:

"You've reached today's free limit of 5 images. Your limit will reset tomorrow."

==================================================

3. TECH STACK

==================================================

Frontend:

- React

- TypeScript

- Tailwind CSS

- Vite

- React Router

- Lucide React icons

Backend / Automation:

- n8n

- n8n Webhook for backend processing workflow

Storage:

- Cloudinary

AI:

- Configurable free/trial background-removal API

Database:

- PostgreSQL only if authentication and persistent usage/history require it.

Authentication:

- Email/password authentication

- Secure password hashing

- Protected dashboard

Do not expose any private API keys in frontend code.

==================================================

4. COLOR SYSTEM — STRICTLY FOLLOW THIS

==================================================

The website must use the same visual language as the SnapCut AI logo.

Primary visual identity:

- Deep Navy: #050816

- Dark Navy: #080D24

- Purple: #8B2CFF

- Violet: #6C3BFF

- Pink/Magenta: #D946EF

- Electric Blue: #2563FF

- Cyan: #00D9FF

- White: #FFFFFF

- Primary Text: #F8FAFC

- Secondary Text: #94A3B8

- Border: rgba(139, 92, 246, 0.25)

- Success: #22C55E

- Error: #EF4444

Main gradient:

Purple → Violet → Blue → Cyan

Use gradients primarily for:

- CTA buttons

- Logo accents

- Important headings

- Icons

- Borders

- Glow effects

- Processing indicators

Use the dark navy background as the dominant website background.

DO NOT use:

- Green as a primary brand color

- Orange

- Yellow

- Red as a branding color

- Random colorful themes

The final website must visually match the provided SnapCut AI logo:

dark premium background + purple/magenta/blue/cyan neon gradient accents.

==================================================

5. OVERALL DESIGN STYLE

==================================================

Design direction:

- Premium AI SaaS

- Modern

- Professional

- Minimal

- Futuristic

- Clean

- Image-focused

- Dark theme

- Neon gradient accents

- Soft glow effects

- Rounded cards

- Thin glowing borders

Do NOT make the website look like a generic template.

Use:

- Dark navy backgrounds

- Glass-like dark cards

- Subtle purple/blue glows

- Gradient borders

- White typography

- Large visual hierarchy

- Smooth but restrained animations

Avoid excessive animations.

==================================================

6. LOGO / BRANDING

==================================================

Use the SnapCut AI logo style as the visual identity.

Logo concept:

- Square rounded icon

- Purple-to-blue/cyan gradient

- Image/background-removal concept

- AI visual indicator

- "SnapCut AI" wordmark

The logo should visually communicate:

IMAGE → CUT → AI → TRANSPARENT BACKGROUND

Use the logo consistently in:

- Navbar

- Dashboard sidebar

- Login page

- Footer

- Browser favicon if possible

Do not redesign the brand with a different color scheme.

==================================================

7. LANDING PAGE

==================================================

Create the following sections.

------------------------------

NAVBAR

------------------------------

Left:

SnapCut AI logo + wordmark

Navigation:

- Home

- How It Works

- Features

- FAQ

Right:

- Login

- Get Started

Navbar should be sticky or fixed with a subtle dark transparent background.

On mobile:

Use a responsive hamburger menu.

------------------------------

HERO SECTION

------------------------------

Main heading:

"Remove Image Backgrounds

in One Click"

Highlight:

"One Click" using a purple → blue → cyan gradient.

Supporting text:

"Upload an image, let AI remove the background, and download a clean transparent image in seconds."

Primary CTA:

"Remove Background"

Secondary CTA:

"See How It Works"

Hero should include a large before/after image-removal visual.

Show an image where:

- Left side = original image with background

- Right side = transparent-background version

- Center = glowing cut line

Use a checkerboard transparency pattern on the processed side.

Add subtle purple/cyan glow behind the visual.

------------------------------

UPLOAD AREA

------------------------------

Create a large premium upload card.

Text:

"Drop your image here"

"or click to browse"

Supported:

"PNG, JPG, JPEG, WEBP • Max 5 MB"

Features:

- Drag and drop

- Click to upload

- File picker

- Image preview

- File validation

- Remove selected image

- Processing state

- Success state

- Error state

Primary button:

"Remove Background"

The upload card should have:

- Dark navy background

- Purple/blue glowing border

- Dashed inner border

- Upload icon

- Subtle hover animation

------------------------------

FEATURES

------------------------------

Create 6 feature cards:

1. One Click

"Remove image backgrounds with a single click."

2. AI Powered

"AI automatically detects the main subject and removes the background."

3. Transparent PNG

"Download clean transparent images."

4. Fast Processing

"Get your processed image within seconds."

5. Drag & Drop

"Upload images quickly using drag and drop."

6. Secure & Private

"Temporary image processing with automatic cleanup."

Use gradient icons.

------------------------------

HOW IT WORKS

------------------------------

Heading:

"How It Works"

Three steps:

01

Upload Image

"Upload or drag and drop your image."

02

AI Removes Background

"Our AI detects the subject and removes the background."

03

Download Result

"Download your clean transparent image."

Connect the three steps visually with a subtle gradient line.

------------------------------

BEFORE / AFTER

------------------------------

Create a large interactive before/after comparison.

Left:

Original

Right:

Background Removed

Use a draggable comparison slider if practical.

The processed image must display over a checkerboard transparency pattern.

------------------------------

USAGE LIMIT

------------------------------

Create a simple section explaining the free practice MVP.

Heading:

"Free to Use"

Text:

"Process up to 5 images per day."

Display:

"5 successful background removals every day"

Do NOT mention pricing, subscriptions, payment, premium plans, or checkout.

------------------------------

FAQ

------------------------------

Questions:

"Which image formats are supported?"

Answer:

"PNG, JPG, JPEG, and WEBP."

"How many images can I process?"

Answer:

"Registered users can successfully process up to 5 images per day."

"Does a failed processing attempt count?"

Answer:

"No. Only a successful background-removal operation counts toward the daily limit."

"Are my images stored permanently?"

Answer:

"No. Images should be treated as temporary and automatically removed according to the configured retention policy."

"Do I need professional editing software?"

Answer:

"No. SnapCut AI is designed to remove backgrounds automatically."

------------------------------

FOOTER

------------------------------

Include:

- SnapCut AI logo

- Short product description

- Home

- How It Works

- Features

- FAQ

- Privacy Policy

- Terms

- Contact

- Copyright

==================================================

8. AUTHENTICATION

==================================================

Create:

/login

/register

/forgot-password if supported

Registration fields:

- Name

- Email

- Password

- Confirm Password

Login:

- Email

- Password

Use secure authentication.

Never store plaintext passwords.

After login:

Redirect user to:

/dashboard

==================================================

9. DASHBOARD

==================================================

Create a professional dark dashboard matching the logo.

Layout:

Left sidebar:

- SnapCut AI logo

- Dashboard

- Remove Background

- History

- Usage

- Settings

- Logout

Main area:

Welcome section:

"Welcome back!"

Primary button:

"+ Remove Background"

Statistics cards:

Today's Usage

"2 / 5"

Remaining

"3"

Total Processed

"12"

Use circular gradient progress indicators.

Recent Images:

Display recently processed images as cards.

Each card:

- Thumbnail

- Filename

- Date

- Download button

If there is no history:

"No processed images yet."

CTA:

"Remove your first background"

==================================================

10. IMAGE PROCESSING PAGE

==================================================

Route:

/remove-background

Layout:

Top:

Back to Dashboard

Title:

"Remove Background"

Upload section.

After upload:

Show original image preview.

Button:

"Remove Background"

During processing:

Show animated gradient processing indicator.

Text:

"AI is removing the background..."

Secondary text:

"This may take a few seconds."

Disable the processing button while processing.

Prevent duplicate requests.

After successful processing:

Create a two-panel comparison.

LEFT:

Original

RIGHT:

Background Removed

Processed image should be shown on checkerboard transparency background.

Below:

"Processing Complete"

"AI successfully removed the background."

Primary button:

"Download PNG"

Secondary:

"Process Another Image"

==================================================

11. IMAGE VALIDATION

==================================================

Allowed:

- JPG

- JPEG

- PNG

- WEBP

Maximum file size:

5 MB

Reject invalid files before sending them to the backend.

Error messages:

Unsupported format:

"This file format isn't supported. Please upload PNG, JPG, JPEG, or WEBP."

Too large:

"This image is too large. Maximum file size is 5 MB."

No file:

"Please select an image first."

==================================================

12. BACKEND WORKFLOW

==================================================

Use n8n.

Architecture:

React

↓

n8n Webhook

↓

Validation

↓

Usage Check

↓

Cloudinary Temporary Upload

↓

AI Background Removal API

↓

Cloudinary Processed Result

↓

Response

↓

React Preview

↓

Download

n8n workflow:

1. Webhook receives image.

2. Validate request.

3. Validate MIME type.

4. Validate file size.

5. Identify user.

6. Check daily usage.

7. Reject if limit is reached.

8. Generate unique processing ID.

9. Upload temporary image to Cloudinary if required.

10. Send image to AI background-removal API.

11. Wait for API response.

12. Validate AI response.

13. Upload processed result to Cloudinary.

14. Increment usage ONLY after successful AI processing.

15. Return processed image URL.

16. Schedule/delete temporary files according to retention policy.

17. Return structured response.

==================================================

13. API

==================================================

Create:

POST /api/v1/remove-background

Request:

multipart/form-data

image=<file>

Success:

{

  "success": true,

  "data": {

    "originalImageUrl": "...",

    "processedImageUrl": "...",

    "processingId": "...",

    "format": "png"

  },

  "message": "Background removed successfully"

}

Error:

{

  "success": false,

  "error": {

    "code": "IMAGE_PROCESSING_FAILED",

    "message": "Unable to process the image. Please try again."

  }

}

Never expose:

- API keys

- Internal stack traces

- Provider secrets

- Database errors

==================================================

14. AI API

==================================================

Use a configurable free/trial background-removal API.

Environment variables:

BACKGROUND_REMOVAL_API_URL=

BACKGROUND_REMOVAL_API_KEY=

Do not hard-code credentials.

The AI integration must:

- Authenticate securely

- Send image

- Handle timeout

- Handle rate limit

- Handle failed processing

- Validate response

- Return normalized result

If no AI API credentials are available during development, create a clearly isolated mock adapter for development only.

Do NOT fake a production AI result.

==================================================

15. CLOUDINARY

==================================================

Use Cloudinary for temporary image storage.

Environment variables:

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

Requirements:

- Secure uploads

- Unique file IDs

- Temporary storage

- Separate original/result references

- Automatic cleanup

- Never expose API secret in frontend

Do not permanently store user images unnecessarily.

==================================================

16. USAGE SYSTEM

==================================================

Registered user limit:

5 successful background-removal operations per day.

Usage rules:

Upload:

0 usage

Invalid image:

0 usage

AI failure:

0 usage

Network failure:

0 usage

Successful AI processing:

+1 usage

Download:

0 usage

The usage counter must be updated server-side.

Never trust a usage value from the frontend.

Show:

"5 / 5 remaining today"

After successful processing:

"4 / 5 remaining today"

When limit is reached:

"Today's limit reached. You can process more images after the limit resets."

==================================================

17. DATABASE

==================================================

Use PostgreSQL if persistent authentication/history is implemented.

User:

- id

- name

- email

- passwordHash

- createdAt

- updatedAt

ImageProcessing:

- id

- userId

- originalFileName

- originalFormat

- status

- processingTime

- temporaryStorageReference

- createdAt

Usage:

- id

- userId

- date

- processingCount

Create indexes for:

- userId

- date

Do NOT create:

- Payment table

- Subscription table

- Billing table

- Credit purchase table

==================================================

18. HISTORY PAGE

==================================================

Route:

/history

Display:

- Thumbnail

- Filename

- Processing status

- Date

- Processing time

- Download button

If image has been deleted from temporary storage, handle it gracefully.

Do not show broken image URLs without an explanation.

==================================================

19. SETTINGS PAGE

==================================================

Route:

/settings

Include:

- Name

- Email

- Password change

- Logout

Keep settings simple.

Do not add unnecessary account-management features.

==================================================

20. SECURITY

==================================================

Implement:

- Server-side file validation

- File-size validation

- MIME validation

- Rate limiting

- Request throttling

- Duplicate request prevention

- Authentication protection

- Authorization

- Secure sessions

- Secure API credentials

- CORS restrictions

- Secure headers

- Temporary file cleanup

- No sensitive logs

Prevent:

- API abuse

- Malicious uploads

- Duplicate requests

- Unauthorized history access

- Unauthorized downloads

- Frontend usage-counter manipulation

==================================================

21. RESPONSIVE DESIGN

==================================================

Support:

Mobile:

320px+

Tablet:

768px+

Desktop:

1024px+

Large desktop:

1440px+

Requirements:

- No horizontal scrolling

- Responsive navbar

- Mobile sidebar

- Touch-friendly upload

- Responsive before/after comparison

- Responsive dashboard cards

- Responsive image previews

- Accessible buttons

==================================================

22. ACCESSIBILITY

==================================================

Implement:

- Semantic HTML

- Keyboard navigation

- Focus states

- Accessible buttons

- Proper labels

- Alt text

- Screen-reader-friendly errors

- Good color contrast

Drag-and-drop must NOT be the only upload method.

==================================================

23. ANIMATIONS

==================================================

Use subtle animations:

- Button hover

- Card hover

- Gradient glow

- Upload hover

- Processing spinner

- Progress indicators

- Page transitions where appropriate

Do NOT use:

- Excessive bouncing

- Large distracting animations

- Slow page transitions

- Constant moving backgrounds

Animations should support the premium AI SaaS aesthetic.

==================================================

24. PERFORMANCE

==================================================

Implement:

- Client-side validation

- Optimized image previews

- Lazy loading

- Efficient API requests

- Request timeouts

- Loading states

- Duplicate request prevention

Do not upload invalid files.

==================================================

25. SEO

==================================================

Title:

"SnapCut AI — Remove Image Backgrounds in One Click"

Description:

"Remove image backgrounds instantly with AI. Upload an image, get a clean transparent result, and download it in seconds."

Implement:

- Semantic HTML

- Meta description

- Open Graph metadata

- Sitemap

- Robots configuration

- Proper headings

==================================================

26. PROJECT STRUCTURE

==================================================

Use a clean architecture:

snapcut-ai/

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── layouts/

│   │   ├── hooks/

│   │   ├── services/

│   │   ├── types/

│   │   ├── utils/

│   │   └── lib/

│   └── package.json

│

├── backend/

│   ├── src/

│   │   ├── routes/

│   │   ├── controllers/

│   │   ├── services/

│   │   ├── middleware/

│   │   ├── validators/

│   │   └── utils/

│   └── package.json

│

├── n8n/

│   └── workflows/

│

├── prisma/

│   └── schema.prisma

│

├── .env.example

└── README.md

Adapt the structure when necessary for the selected AI website builder, but maintain clean separation between UI, business logic, backend integration, and automation.

==================================================

27. ENVIRONMENT VARIABLES

==================================================

Create:

.env.example

Include:

DATABASE_URL=

BACKGROUND_REMOVAL_API_URL=

BACKGROUND_REMOVAL_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

FREE_DAILY_LIMIT=5

Never include real credentials.

==================================================

28. TESTING

==================================================

Test:

1. User registration

2. Login

3. Upload valid image

4. Invalid file rejection

5. Oversized image rejection

6. Successful AI processing

7. AI failure

8. Cloudinary failure

9. Network timeout

10. Usage increment after success

11. Usage NOT incremented after failure

12. Daily limit reached

13. Download processed image

14. Processing history

15. Logout

16. Protected dashboard

17. Mobile layout

18. Desktop layout

19. Duplicate request prevention

==================================================

29. RESTRICTIONS

==================================================

DO NOT:

- Build only a static landing page.

- Fake AI processing.

- Use a hard-coded processed image.

- Expose API keys.

- Store plaintext passwords.

- Permanently store images unnecessarily.

- Add payment functionality.

- Add subscriptions.

- Add Stripe.

- Add Razorpay.

- Add checkout.

- Add paid credits.

- Add premium plans.

- Add billing.

- Add unnecessary advanced image editing tools.

- Add background replacement to the MVP.

- Add bulk processing to the MVP.

- Add mobile application.

- Add unnecessary analytics.

- Create non-functional buttons.

- Use random colors outside the defined brand palette.

- Use a light theme as the primary theme.

==================================================

30. FUTURE-READY BUT SIMPLE

==================================================

Keep the architecture extensible for future features:

- Background replacement

- AI image editing

- Bulk processing

- Branding templates

- Business API

- Mobile app

- Paid plans

However, DO NOT implement these features now.

The MVP must remain simple.

==================================================

31. FINAL UX GOAL

==================================================

The user should understand the product immediately.

The primary journey must feel like:

OPEN WEBSITE

↓

UPLOAD IMAGE

↓

CLICK "REMOVE BACKGROUND"

↓

WAIT A FEW SECONDS

↓

SEE BEFORE/AFTER

↓

DOWNLOAD PNG

The interface must make this workflow the dominant visual experience.

==================================================

32. FINAL IMPLEMENTATION REQUIREMENT

==================================================

Generate the complete working SnapCut AI application.

Do not stop after generating the landing page.

Implement:

- Landing page

- Authentication

- Dashboard

- Upload system

- Image validation

- AI integration

- n8n workflow

- Cloudinary integration

- Usage limit

- Before/after preview

- Transparent PNG download

- Processing history

- Settings

- Error handling

- Loading states

- Empty states

- Responsive design

- Accessibility

- Security

- Environment configuration

- Database schema where required

- README

- Deployment instructions

Every primary button must perform a real action.

Every important API operation must have validation and error handling.

Use the exact SnapCut AI dark navy + purple + magenta + blue + cyan visual identity throughout the application.

The final result should look like a polished, professional AI SaaS product rather than a basic student project, while keeping the underlying MVP architecture simple and avoiding unnecessary payment, subscription, and business complexity.
use the attached image for  logo  and for website color theme identification

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ba135148-d25c-487f-8bca-c3be5e831503).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
