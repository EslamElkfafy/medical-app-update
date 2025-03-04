"use client";
import { AppointmentProps, DoctorDetail } from "@/types/types";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "@/components/ui/calendar";
import { getDayFromDate } from "@/utils/getDayFromDate";
import { getLongDate } from "@/utils/getLongDate";
import { Loader2, MoveRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import TextInput from "./FormInputs/TextInput";
import { DatePickerInput } from "./FormInputs/DatePickerInput";
import RadioInput from "./FormInputs/RadioInput";
import { TextAreaInput } from "./FormInputs/TextAreaInput";
import MultipleFileUpload, { FileProps } from "./FormInputs/MultipleFileUpload";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { createAppointment } from "@/actions/appointments";
import { Appointment, DoctorProfile } from "@prisma/client";
import FrontDoctorDetails from "./FrontDoctorDetails";
export default function DoctorDetails({
  doctor,
  appointment,
  doctorProfile,
}: {
  doctor: DoctorDetail;
  appointment: Appointment | null;
  doctorProfile: DoctorProfile | null | undefined;
}) {
  const [isActive, setIsActive] = useState("availability");
  const { data: session } = useSession();
  const patient = session?.user;
  const [step, setStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const day = getDayFromDate(date?.toDateString());
  const longDate = getLongDate(date!.toDateString());
  const [dob, setDob] = useState<Date | undefined>(undefined);
  console.log(longDate);
  const times = doctor.doctorProfile?.availability?.[day] ?? null;
  const [medicalDocs, setMedicalDocs] = useState<FileProps[]>([]);
  const genderOptions = [
    {
      label: "Male",
      value: "male",
    },
    {
      label: "Female",
      value: "female",
    },
  ];
  // const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentProps>({
    defaultValues: {
      email: appointment?.email ?? "",
      firstName: appointment?.firstName ?? "",
      phone: appointment?.phone ?? "",
      lastName: appointment?.lastName ?? "",
      occupation: appointment?.occupation ?? "",
      location: appointment?.location ?? "",
      gender: appointment?.gender ?? "",
    },
  });
  async function onSubmit(data: AppointmentProps) {
    data.medicalDocuments = medicalDocs.map((item) => item.url);
    data.appointmentDate = date;
    data.appointmentFormattedDate = longDate;
    data.appointmentTime = selectedTime;
    (data.doctorId = doctor.id),
      (data.charge = doctor.doctorProfile?.hourlyWage ?? 0);
    data.dob = dob;
    data.patientId = patient?.id ?? "";
    data.doctorName = doctor.name;
    console.log(data);
    try {
      setLoading(true);
      const res = await createAppointment(data);
      const appo = res.data;
      setLoading(false);
      toast.success("Appointment Created Successfully");
      router.push("/dashboard/user/appointments");
      console.log(appo);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
    // router.push("/dashboard/services");
  }
  function initiateAppointment() {
    if (patient?.id) {
      if (!selectedTime) {
        toast.error("Please select time");
        return;
      }
      setStep((curr) => curr + 1);
    } else {
      router.push("/login");
    }
  }
  return (
    <>
      {step === 1 ? (
        <div className="">
          <div className="flex items-center  justify-between ">
            <button
              onClick={() => setIsActive("details")}
              className={
                isActive === "details"
                  ? "py-4 px-8 w-full uppercase tracking-widest bg-blue-600 text-white"
                  : "border border-gray-200 bg-slate-100 w-full text-slate-800 py-4 px-8 uppercase tracking-widest"
              }
            >
              Doctor Details
            </button>
            <button
              onClick={() => setIsActive("availability")}
              className={
                isActive === "availability"
                  ? "py-4 px-8 w-full bg-blue-600 text-white uppercase tracking-widest"
                  : "border border-gray-200 bg-slate-100 w-full text-slate-800 py-4 px-8 uppercase tracking-widest"
              }
            >
              Availability
            </button>
          </div>
          <div className="py-8 px-6">
            {isActive === "availability" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="">
                  <span className="text-blue-600 text-sm">
                    You have selected
                  </span>
                  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    {longDate}
                  </h2>
                  {times && times.length > 0 && (
                    <div className="py-3 grid grid-cols-4 gap-2">
                      {times.map((item, i) => {
                        return (
                          <Button
                            key={i}
                            onClick={() => setSelectedTime(item)}
                            variant={
                              selectedTime === item ? "default" : "outline"
                            }
                          >
                            {item}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                  <div className="py-4">
                    <button
                      onClick={initiateAppointment}
                      type="button"
                      className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
                    >
                      Book Doctor ($
                      {doctor.doctorProfile?.hourlyWage})
                      <MoveRight className="w-6 h-6 ml-3" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <FrontDoctorDetails doctorProfile={doctorProfile} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 ">
          {/* 
          // FullName
          // Gender
          // Phone Number
          //EMAIL
          //date of Birth
          //Address/Location
          // Reason why you want to see the doctor
          // Upload medical documents
          //occupation
           */}
          <form
            className=" py-4 px-4  mx-auto "
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="scroll-m-20 border-b pb-3 mb-6 text-3xl font-semibold tracking-tight first:mt-0 ">
              Tell us a few Details about You
            </h2>
            {step === 2 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6 ">
                  <TextInput
                    label="First Name"
                    register={register}
                    name="firstName"
                    errors={errors}
                    className="col-span-1"
                    placeholder="Enter First Name"
                  />
                  <TextInput
                    label="Last Name"
                    register={register}
                    name="lastName"
                    className="col-span-1"
                    errors={errors}
                    placeholder="Enter Last Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <TextInput
                    label="Phone Number"
                    register={register}
                    name="phone"
                    errors={errors}
                    className="col-span-1"
                    placeholder="Enter Phone Number"
                  />
                  <TextInput
                    label="Email Address"
                    register={register}
                    name="email"
                    className="col-span-1"
                    errors={errors}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <RadioInput
                    title="Gender"
                    register={register}
                    name="gender"
                    errors={errors}
                    className="col-span-1"
                    radioOptions={genderOptions}
                  />
                  <DatePickerInput
                    date={dob}
                    setDate={setDob}
                    title="Date of Birth"
                    className="col-span-1"
                  />
                </div>
                <div className="mt-8 flex justify-between gap-4 items-center">
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => setStep((currStep) => currStep - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep((currStep) => currStep + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6 ">
                  <TextInput
                    label="Your Location"
                    register={register}
                    name="location"
                    errors={errors}
                    className="col-span-1"
                    placeholder="Enter your Location"
                  />
                  <TextInput
                    label="Occupation"
                    register={register}
                    name="occupation"
                    className="col-span-1"
                    errors={errors}
                    placeholder="Enter your Occupation"
                  />
                </div>
                <TextAreaInput
                  label="Reason for Seeing the Doctor"
                  register={register}
                  name="appointmentReason"
                  errors={errors}
                  placeholder="Enter appointment Reason"
                />

                <MultipleFileUpload
                  label="Medical Documents"
                  files={medicalDocs}
                  setFiles={setMedicalDocs}
                  endpoint="patientMedicalFiles"
                />
                <div className="mt-8 flex justify-between gap-4 items-center">
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => setStep((currStep) => currStep - 1)}
                  >
                    Previous
                  </Button>
                  {loading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving please wait ...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      onClick={() => setStep((currStep) => currStep + 1)}
                    >
                      Complete Appointment
                    </Button>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}
