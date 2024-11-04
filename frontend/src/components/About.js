import React from "react";
import teamImage from "../assets/GAM_VCS_Summer_2024.webp"; // Ensure you have a suitable image in your assets

const About = () => {
	return (
		<div className="flex flex-col items-center justify-center px-6 mt-[36rem] mb-3 rounded-xl pb-8 min-h-screen text-white bg-gradient-to-br from-gray-800 via-green-800 to-emerald-800 space-y-20">
			{/* Hero Section */}
			<div className="text-center mb-10 w-4/5 mx-auto space-y-6">
				<h1 className="text-4xl font-bold">About Us</h1>
				<p className="text-xl max-w-2xl mx-auto">
					We are dedicated to providing the best service for our users. Our team
					works hard to ensure a seamless experience, and we value your
					feedback.
				</p>
				<img
					src={teamImage}
					alt="Our Team"
					className="rounded-lg shadow-lg w-full max-w-3xl"
				/>
			</div>

			{/* Mission and Values Section */}
			<div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-lg shadow-md space-y-4">
				<h2 className="text-3xl font-semibold">Our Mission</h2>
				<p className="text-lg">
					Our mission is to empower users through technology, providing them
					with the tools they need to succeed and achieve their goals.
				</p>
				<h2 className="text-3xl font-semibold">Our Values</h2>
				<ul className="list-disc list-inside text-lg space-y-1">
					<li>Integrity</li>
					<li>Innovation</li>
					<li>Community</li>
					<li>Excellence</li>
				</ul>
			</div>

			{/* Statistics Section */}
			<div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-lg shadow-md space-y-4">
				<h2 className="text-3xl font-semibold">Our Impact</h2>
				<div className="flex justify-around text-center space-x-6">
					<div>
						<h3 className="text-2xl font-bold">100+</h3>
						<p className="text-sm">Happy Clients</p>
					</div>
					<div>
						<h3 className="text-2xl font-bold">50+</h3>
						<p className="text-sm">Projects Completed</p>
					</div>
					<div>
						<h3 className="text-2xl font-bold">5</h3>
						<p className="text-sm">Years of Experience</p>
					</div>
				</div>
			</div>

			{/* Closing Statement */}
			<p className="text-lg max-w-2xl mx-auto text-center">
				Thank you for choosing us! We are excited to be part of your journey.
			</p>
		</div>
	);
};

export default About;
