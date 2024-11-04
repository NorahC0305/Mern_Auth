import React from "react";

const Footer = () => {
	return (
		<footer className="bg-black p-6">
			<div className="container mx-auto flex items-center justify-between">
				<p className="text-white">Copyright 2024 All rights reserved</p>
				<p className="text-white">
					Made with by{" "}
					<a
						href="https://github.com/NorahC0305"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline"
					>
						Norah
					</a>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
