import { useEffect } from "react";
import Slider from "react-slick";
import "./offersCarousel.css";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { useState } from "react";
import { v4 as uuvidv4 } from "uuid";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OffersCarousel({ category }) {
	const [isLoading, setIsLoading] = useState(true);
	const [slideData, setSlideData] = useState([]);

	const slideOptions = {
		dots: true,
		dotsClass: "slick-dots slick-custom-dots",
		customPaging: function () {
			return <span></span>;
		},
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplaySpeed: 2000,
		autoplay: true,
		nextArrow: <CustomNextArrow className="customNextBtn" />,
		prevArrow: <CustomPrevArrow className="customNextBtn" />,
		pauseOnHover: false
	};

	useEffect(() => {
		const fetchImages = async () => {
			try {
				await new Promise((resolve) => setTimeout(resolve, 500));
				const images = [
					{ id: uuvidv4(), img: "/assets/men.jpg" },
					{ id: uuvidv4(), img: "/assets/men2.jpg" },
					{ id: uuvidv4(), img: "/assets/women.jpg" },
					{ id: uuvidv4(), img: "/assets/women4.jpg" },
				];
				setSlideData(images);
			} catch (error) {
				console.error("Error fetching images:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchImages();
	}, []);
	return (
		<section className="banner_carousel">
			<div className="container">
				{isLoading ? (
					<SkeletonTheme baseColor="#f3f3f3" highlightColor="#d9d9d9" enableAnimation={true}>
						<Skeleton count={1} width={"1500px"} height={"220px"}  containerClassName="flex-1" />
					 </SkeletonTheme> 
				) : (
					<Slider {...slideOptions} className="carousel" id={uuvidv4()}>
						{slideData.map((slide) => {
							return (
								<div key={slide.id} className="carousel_box">
									<img src={slide.img} />
								</div>
							);
						})}
					</Slider>
				)}
			</div>
		</section>
	);
}

const dotsCss = {
	width: "30px",
	height: "75px",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	background: "#ffffff",
	boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
	zIndex: 2,
};


function CustomNextArrow(props) {
	const { className, style, onClick } = props;
	return (
		<div
			className={className + " customSliderBtn nextBtn"}
			style={{
				...style,
				...dotsCss,
				right: "0px",
				borderRadius: "7px 0 0 7px",
			}}
			onClick={onClick}
		>
			<FaAngleRight className="nextArrow" />
		</div>
	);
}

function CustomPrevArrow(props) {
	const { className, style, onClick } = props;
	return (
		<div
			className={className + " customSliderBtn prevBtn"}
			style={{
				...style,
				...dotsCss,
				left: "0px",
				borderRadius: "0 7px 7px 0",
			}}
			onClick={onClick}
		>
			<FaAngleLeft className="prevArrow" />
		</div>
	);
}