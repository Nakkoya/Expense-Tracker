import moment from "moment";
const parseDate = (data) => {
	const date = String(moment(data)._d);
	let result = date.substr(4, 3);
	if (date.substr(8, 1) === "0") {
		result = result.concat(" ", date.substr(9, 1));
	} else {
		result = result.concat(" ", date.substr(8, 2));
	}

	result = result.concat(", ", date.substr(11, 4));
	result = result.concat(" ", date.substr(16, 2));
	result = result.concat(":", date.substr(19, 2));
	return result;
};

export default parseDate;
