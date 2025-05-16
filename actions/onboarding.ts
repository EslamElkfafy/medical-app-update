"use server";

import WelcomeEmail from "@/components/Emails/welcome-email";
import axiosInstance from "@/lib/axiosInstance";
import { prismaClient } from "@/lib/db";
import axios from "axios";
import { Resend } from "resend";

const DOCTOR_SERVICE_BASE_URL = "http://localhost:8080/onboarding"; // Replace with the actual base URL of your doctor-service

// Create Doctor Profile
export async function createDoctorProfile(doctorRequest: Record<string, any>) {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_BASE_URL}/create-doctor`,
      doctorRequest
    );
    return response.data;
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    throw error;
  }
}

// Save Bio Data
export async function saveBioData(
  userId: string,
  bioInfoRequest: Record<string, any>
) {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_BASE_URL}/${userId}/bio-data`,
      bioInfoRequest
    );
    return {
      data: response.data,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.error("Error saving bio data:", error);
    throw error;
  }
}

// Save Profile Data
export async function saveProfileData(
  userId: string,
  profileInfoRequest: Record<string, any>
) {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_BASE_URL}/${userId}/profile-data`,
      profileInfoRequest
    );
    return {
      data: response.data,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.error("Error saving profile data:", error);
    throw error;
  }
}

// Save Contact Data
export async function saveContactData(
  userId: string,
  contactInfoRequest: Record<string, any>
) {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_BASE_URL}/${userId}/contact-data`,
      contactInfoRequest
    );
    return {
      data: response.data,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.error("Error saving contact data:", error);
    throw error;
  }
}

// Save Education Data
export async function saveEducationData(
  userId: string,
  educationInfoRequest: Record<string, any>
) {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_BASE_URL}/${userId}/education-data`,
      educationInfoRequest
    );
    return {
      data: response.data,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.error("Error saving education data:", error);
    throw error;
  }
}

// Save Practice Data
export async function savePracticeData(
  userId: string,
  practiceInfoRequest: Record<string, any>
) {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_BASE_URL}/${userId}/practice-data`,
      practiceInfoRequest
    );
    return {
      data: response.data,
      status: 201,
      error: null,
    };
  } catch (error) {
    console.error("Error saving practice data:", error);
    throw error;
  }
}

// Save Additional Data
export async function saveAdditionalData(
  userId: string,
  additionalInfoRequest: Record<string, any>
) {
  try {
    const response = await axios.post(
      `${DOCTOR_SERVICE_BASE_URL}/${userId}/additional-data`,
      additionalInfoRequest
    );
    return response.data;
  } catch (error) {
    console.error("Error saving additional data:", error);
    throw error;
  }
}

export async function createAvailability(data: any) {
  try {
    const newAvail = await prismaClient.availability.create({
      data,
    });
    console.log(newAvail);
    return newAvail;
    // const response = await axios.post("https://api-booking-service.vercel.app/api/v1/availability", data);
    // console.log(response.data);
    // return {
    //   data: response.data,
    //   status: 201,
    //   error: null,
    // };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: 500,
      error: "Something went wrong",
    };
  }
}

export async function updateDoctorProfile(id: string | undefined, data: any) {
  if (id) {
    try {
      const updatedProfile = await prismaClient.doctorProfile.update({
        where: {
          id,
        },
        data,
      });
      console.log(updatedProfile);
      return {
        data: updatedProfile,
        status: 201,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        status: 500,
        error: "Profile was not updated",
      };
    }
  }
}
export async function updateAvailabilityById(
  id: string | undefined,
  data: any
) {
  if (id) {
    try {
      const updatedAva = await prismaClient.availability.update({
        where: {
          id,
        },
        data,
      });
      console.log(updatedAva);
      return {
        data: updatedAva,
        status: 201,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        status: 500,
        error: "Availability was not updated",
      };
    }
  }
}

export async function getApplicationByTrack(trackingNumber: string) {
  if (trackingNumber) {
    try {
      const existingProfile = await prismaClient.doctorProfile.findUnique({
        where: {
          trackingNumber,
        },
      });
      if (!existingProfile) {
        return {
          data: null,
          status: 404,
          error: "Wrong Tracking Number",
        };
      }
      return {
        data: existingProfile,
        status: 200,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        status: 500,
        error: "Something Went wrong",
      };
    }
  }
}

export async function completeProfile(id: string | undefined, data: any) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  if (id) {
    try {
      const existingProfile = await prismaClient.doctorProfile.findUnique({
        where: {
          id,
        },
      });
      if (!existingProfile) {
        return {
          data: null,
          status: 404,
          error: "Profile Not Found",
        };
      }

      //send a welcome email
      const firstName = existingProfile.firstName;
      const email = existingProfile.email as string;
      const previewText = "Welcome to Online Doctors ";
      const message =
        "Thank you for joining Online Doctors, we are so grateful that we have onboard ";
      const sendMail = await resend.emails.send({
        from: "Medical App <info@jazzafricaadventures.com>",
        to: email,
        subject: "Welcome to Online Doctors",
        react: WelcomeEmail({ firstName, previewText, message }),
      });
      console.log("Email sent successfully:", sendMail);
      const updatedProfile = await prismaClient.doctorProfile.update({
        where: {
          id,
        },
        data,
      });
      console.log(updatedProfile);
      return {
        data: updatedProfile,
        status: 201,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        status: 500,
        error: "Profile was not updated",
      };
    }
  }
}
export async function getDoctorProfileById(userId: string | undefined) {
  if (userId) {
    try {
      const profile = await prismaClient.doctorProfile.findUnique({
        where: {
          userId,
        },
        include: {
          availability: true,
        },
      });
      console.log(profile);
      return {
        data: profile,
        status: 200,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        status: 500,
        error: "Profile was not fetched",
      };
    }
  }
}

// Add a function to handle the complete onboarding process
export async function completeDoctorOnboarding(
  userId: string,
  onboardingData: {
    bioData: Record<string, any>;
    contactData: Record<string, any>;
    educationData: Record<string, any>;
    practiceData: Record<string, any>;
    profileData: Record<string, any>;
    additionalData: Record<string, any>;
  }
) {
  try {
    // Step 1: Save Bio Data
    await saveBioData(userId, onboardingData.bioData);

    // Step 2: Save Contact Data
    await saveContactData(userId, onboardingData.contactData);

    // Step 3: Save Education Data
    await saveEducationData(userId, onboardingData.educationData);

    // Step 4: Save Practice Data
    await savePracticeData(userId, onboardingData.practiceData);

    // Step 5: Save Profile Data
    await saveProfileData(userId, onboardingData.profileData);

    // Step 6: Save Additional Data
    await saveAdditionalData(userId, onboardingData.additionalData);

    return {
      status: 200,
      message: "Doctor onboarding completed successfully",
    };
  } catch (error) {
    console.error("Error during doctor onboarding:", error);
    return {
      status: 500,
      message: "An error occurred during onboarding",
      error,
    };
  }
}
