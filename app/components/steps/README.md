# Stepper Components

This directory contains the modular step components for the SignUp form with a progress stepper.

## File Structure

### Main Components
- **Step1.tsx** - Business Info (Business Name, Owner Name)
- **Step2.tsx** - Contact & License (Mobile, OTP, Email, License No)
- **Step3.tsx** - Password Setup (Password, Confirm Password)
- **StepNavigation.tsx** - Navigation buttons (Back, Next, Submit)

### Features

#### Stepper Progress Bar
- **Visual Progress**: Shows current step with blue circle and number
- **Completed Steps**: Display checkmark icons for completed steps
- **Progress Lines**: Blue lines connect completed steps, gray lines for pending
- **Interactive**: Click on any step to navigate directly

#### Step Components
- **Modular Design**: Each step is a separate component
- **Form Validation**: Each step has its own validation rules
- **Theme Support**: Supports both light and dark themes
- **Responsive**: Scales properly on different screen sizes

#### Navigation
- **Back Button**: Available on steps 2 and 3
- **Next Button**: Available on steps 1 and 2
- **Submit Button**: Available on step 3
- **Form Integration**: Integrates with Formik for form management

## Usage

The stepper is used in the main SignUp component:

```tsx
<Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />
```

Each step component receives:
- `formik`: Formik form instance
- `theme`: Current theme object

## Progress Visualization

1. **Step 1 (Business Info)**: 
   - Circle with "01" when active
   - Checkmark when completed
   - Blue line to next step when completed

2. **Step 2 (Contact & License)**:
   - Circle with "02" when active
   - Checkmark when completed
   - Blue line to next step when completed

3. **Step 3 (Password Setup)**:
   - Circle with "03" when active
   - Final step (no line after)

## Colors
- **Active/Completed**: `#3bbbc3` (teal)
- **Inactive**: `#777` (gray)
- **Progress Lines**: `#3bbbc3` (completed), `#d0d0d0` (pending)
