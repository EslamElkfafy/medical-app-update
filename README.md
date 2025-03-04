# Medical App

https://tailgrids.com/components/headers
https://elements.envato.com/eduflex-e-learning-hero-section-figma-template-UNPBTDA/preview
https://dribbble.com/shots/14796198--Exploration-Hero-Section?utm_source=pinterest&utm_campaign=pinterest_shot&utm_content=%23Exploration+-+Hero+Section&utm_medium=Social_Share
https://tailwindui.com/components
https://heroicons.com/
https://sesamecare.com/
https://trello.com/b/6uCNVegp/medical-app
https://ui.shadcn.com/docs/components/navigation-menu

///DEMO
https://demo.alloy.health/appointments

<!--CONTEXT  -->

https://www.notion.so/desishub/How-to-Use-Context-API-with-the-Shopping-Cart-Project-863aa2aff5be42d585c2012531267d09

<!-- MORE LINKS -->

https://passports.go.ug/
https://payhip.com/pricing
https://sesamecare.com/join/doctors
https://floatui.com/components/pricing-sections
https://tidycal.com/pricing
https://calendly.com/signup
https://calendly.com/event_types/user/me

import React, { createContext, useState, useContext } from 'react';

interface DoctorOnboardingContextState {
doctor: Doctor | null;
trackingNumber: string | null;
formId: number | null;
currentStep: number;
updateDoctor: (data: Partial<Doctor>) => void;
updateStep: (step: number) => void;
}

const DoctorOnboardingContext = createContext<DoctorOnboardingContextState>({
doctor: null,
trackingNumber: null,
formId: null,
currentStep: 1, // Start from step 1
updateDoctor: () => {},
updateStep: () => {},
});

export const DoctorOnboardingProvider = ({ children }: { children: React.ReactNode }) => {
const [doctor, setDoctor] = useState<Doctor | null>(null);
const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
const [formId, setFormId] = useState<number | null>(null);
const [currentStep, setCurrentStep] = useState<number>(1);

const updateDoctor = (data: Partial<Doctor>) => {
setDoctor((prevDoctor) => ({ ...prevDoctor, ...data }));
};

const updateStep = (step: number) => {
setCurrentStep(step);
};

return (
<DoctorOnboardingContext.Provider
value={{ doctor, trackingNumber, formId, currentStep, updateDoctor, updateStep }} >
{children}
</DoctorOnboardingContext.Provider>
);
};

export const useDoctorOnboardingContext = () => useContext(DoctorOnboardingContext);

export default DoctorOnboardingContext;

https://www.google.com/imgres?q=doctor%20profile&imgurl=https%3A%2F%2Fahamediagroup.com%2Fwp-content%2Fuploads%2F2021%2F09%2FDoctorProfiles2.png&imgrefurl=https%3A%2F%2Fahamediagroup.com%2Fblog%2Fhow-to-use-physician-bios-to-attract-new-patients-6-examples%2F&docid=m2XWxul4oGMFuM&tbnid=-aw41csIpLCvwM&vet=12ahUKEwiO5L3Uzq-GAxVG-gIHHQW9AI0QM3oECGAQAA..i&w=974&h=691&hcb=2&ved=2ahUKEwiO5L3Uzq-GAxVG-gIHHQW9AI0QM3oECGAQAA

https://www.google.com/imgres?q=doctor%20profile%20page&imgurl=https%3A%2F%2Fmir-s3-cdn-cf.behance.net%2Fproject_modules%2F1400%2F00214b43182531.57e6368fb09b8.png&imgrefurl=https%3A%2F%2Fwww.behance.net%2Fgallery%2F43182531%2FDoctor-Profile-Design&docid=lcJm75Byt7XV6M&tbnid=jMuvcQ-TbwdCLM&vet=12ahUKEwjTntTgzq-GAxXc9gIHHZLaDvwQM3oECH0QAA..i&w=1400&h=1621&hcb=2&ved=2ahUKEwjTntTgzq-GAxXc9gIHHZLaDvwQM3oECH0QAA

https://www.google.com/imgres?q=doctor%20profile%20page&imgurl=https%3A%2F%2Fblog.tbhcreative.com%2Fwp-content%2Fuploads%2Fphysician-bio-orthonebraska.png&imgrefurl=https%3A%2F%2Fblog.tbhcreative.com%2Fhave-the-best-doctor-pages-on-hospital-websites%2F&docid=LqHDdM14ZLVFGM&tbnid=As36NVSV_IFR7M&vet=12ahUKEwjTntTgzq-GAxXc9gIHHZLaDvwQM3oECFYQAA..i&w=1083&h=785&hcb=2&ved=2ahUKEwjTntTgzq-GAxXc9gIHHZLaDvwQM3oECFYQAA

https://www.google.com/imgres?q=doctor%20profile&imgurl=https%3A%2F%2Fimg.freepik.com%2Fpremium-psd%2Fdoctor-profile-resume-cv-design_139955-45.jpg&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Fpremium-psd%2Fdoctor-profile-resume-cv-design_6365046.htm&docid=NSqyj0AVJXzjzM&tbnid=2QIEHn-LsFQTwM&vet=12ahUKEwiO5L3Uzq-GAxVG-gIHHQW9AI0QM3oECBYQAA..i&w=556&h=626&hcb=2&ved=2ahUKEwiO5L3Uzq-GAxVG-gIHHQW9AI0QM3oECBYQAA
