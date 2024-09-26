import React from "react";
import { Metadata } from "next";
import CustomLayout from "@/layout/CustomLayout";

/**
 * Metadata for the Release of Liability page.
 * @type {Metadata}
 * @property {string} title - The title of the page.
 * @property {string} description - A brief description of the page.
 */
export const metadata: Metadata = {
  title: "Chasing Watts | Release of Liability",
  description: "Release of Liability for Chasing Watts",
};

/**
 * Liability page component.
 *
 * This page displays the release of liability information for participants in cycling events.
 *
 * @returns {JSX.Element} The rendered Liability page.
 */
const LiabilityPage = (): JSX.Element => {
  return (
    <CustomLayout>
      <section className="py-10 mt-28">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Release of Liability</h1>
          <div className="bg-white p-6 shadow-md rounded-md">
            <div>
              <div>
                <p className="font-bold mb-2">Group ride requirements:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>You must wear a helmet</li>
                  <li>Bike in good working condition</li>
                  <li>Water &amp; nutrition</li>
                  <li>Mobile phone</li>
                  <li>No headphones/radios.</li>
                  <li>Follow and adhere to all applicable state laws</li>
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="font-bold">
                  ASSUMPTION OF RISK AND RELEASE OF LIABILITY
                </h3>
                <p className="mb-3">
                  I, the registrant, voluntarily choose to participate in the
                  above-referenced cycling events or activities (hereinafter
                  referred to as the Event). I understand that participation in
                  cycling activities entails certain inherent risks including,
                  but not limited to, falls, collisions with vehicles, other
                  participants, fixed or moving objects, and the unpredictable
                  actions of others.
                </p>
                <h3 className="font-bold">RISKS ASSOCIATED WITH CYCLING</h3>
                <p className="mb-3">
                  I acknowledge that the Event may be conducted on public or
                  private roads, trails, or other facilities open to the public,
                  and upon which hazards may exist. I am fully aware of and
                  assume the risks associated with cycling, which may include,
                  but are not limited to, serious injury, permanent disability,
                  or even death.
                </p>
                <h3 className="font-bold">RELEASE AND WAIVER OF LIABILITY</h3>
                <p className="mb-3">
                  In consideration of being allowed to participate in the Event,
                  I hereby agree, on behalf of myself, my heirs, executors,
                  administrators, and assigns, to release, waive, discharge, and
                  hold harmless [Event Organizer], its employees, agents,
                  volunteers, sponsors, and affiliates (collectively referred to
                  as the Released Parties) from any and all liability, claims,
                  demands, actions, or rights of action, which are related to,
                  arise out of, or are in any way connected with my
                  participation in the Event, including those allegedly
                  attributed to the negligent acts or omissions of the Released
                  Parties.
                </p>
                <h3 className="font-bold">INDEMNIFICATION</h3>
                <p className="mb-3">
                  I further agree to indemnify and hold harmless the Released
                  Parties from any and all liabilities or claims made as a
                  result of my participation in the Event, whether caused by the
                  negligence of the Released Parties or otherwise.
                </p>
                <h3 className="font-bold">MEDICAL TREATMENT</h3>
                <p className="mb-3">
                  In the event of an accident, injury, or illness during my
                  participation in the Event, I hereby consent to receive
                  medical treatment as deemed necessary by medical
                  professionals. I understand and agree that I am solely
                  responsible for any medical expenses that may result from such
                  treatment.
                </p>
                <h3 className="font-bold">PHOTOGRAPHY AND MEDIA RELEASE</h3>
                <p className="mb-3">
                  I grant permission to the Event Organizer and its agents to
                  take and use photographs, video recordings, or any other media
                  of me during the Event for promotional or advertising
                  purposes, without compensation.
                </p>
                <h3 className="font-bold">ACKNOWLEDGMENT OF UNDERSTANDING</h3>
                <p className="mb-3">
                  I have read this Release of Liability and fully understand its
                  terms. By registering and joining any ride, I understand that
                  I am giving up substantial rights, including my right to sue,
                  and I agree to this release freely and voluntarily.
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-2 mt-4">
                Last updated September 2024
              </p>
            </div>
          </div>
        </div>
      </section>
    </CustomLayout>
  );
};

export default LiabilityPage;
