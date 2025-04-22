function Filters({filter}) {
	let component;

	switch (filter.type) {
		case "checkbox":
			component = <CheckBoxFilter options={filter.options} name={filter.name} contClass={"filter-checkbox"} />;
			break;
		case "radio":
			component = <RadioFilter options={filter.options} name={filter.name} contClass={"filter-radio"} />;
			break;
		case "select":
			component = <SelectFilter options={filter.options} name={filter.name} contClass={"filter-select"} />;
			break;
		case "slider":
			component = <SliderFilter options={filter.options} name={filter.name} contClass={"filter-slider"} />;
			break;
		default:
			component = null;
	}

	return component;
}

function SliderFilter({ options, name, contClass }) {
	return (
		<div className={contClass}>
			<label htmlFor={name}>{name}</label>
			<div>
				<span className={name + "-min"}>{options.min}</span>
				<input type="range" name={name} id={name} />
				<span className={name + "-max"}>{options.max}</span>
			</div>
		</div>
	);
}

function SelectFilter({ contClass, options, name }) {
	return (
		<div>
			<p>{name}</p>
			<select name={name} id={name} className={contClass}>
				{options.map((opts, i) => (
					<options key={opts + i}>{opts}</options>
				))}
			</select>
		</div>
	);
}

function RadioFilter({ contClass, options, name }) {
	return (
		<div className={contClass}>
			<p>{name}</p>
			{options.map((opts) => (
				<span key={opts}>
					<input type="radio" name={name} id={opts} value={opts} />
					<label htmlFor={opts}>{opts}</label>
				</span>
			))}
		</div>
	);
}

function CheckBoxFilter({ options, name, contClass }) {
	return (
		<div className={contClass}>
			<p>{name}</p>
			{options.map((opts) => (
				<span key={opts}>
					<input type="checkbox" name={opts} id={opts} value={opts} />
					<label htmlFor={opts}>{opts}</label>
				</span>
			))}
		</div>
	);
}

export default Filters;
