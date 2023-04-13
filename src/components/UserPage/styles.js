export const card = { display: "flex", borderRadius: 2, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 };

export const cardMedia = {
	maxHeight: { xs: 140, md: 220 },
	minHeight: { xs: 140, md: 220 },
	maxWidth: { xs: 140, md: 220 },
	minWidth: { xs: 140, md: 220 },
	borderRadius: 2,
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
};

export const list = {
	padding: 0,
	borderRadius: "0px",
	width: "100%",
	overflow: "auto",
	maxHeight: "70vh",
	"& ul": { padding: 0 },
};

export const modal = {
	padding: 0,
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	border: "0px solid",
	boxShadow: 4,
	minWidth: { xs: "80vw", md: "30vw" },
	maxWidth: { xs: "90vw", md: "50vw" },
};

export const dropzoneContainer = {
	border: "3px dashed #A3C9C9",
	borderRadius: "0px 0px 16px 16px",
	backgroundColor: "#DAEFEF",
	cursor: "pointer",
};

export const dropzone = {
	textAlign: "center",
	padding: "100px",
	borderRadius: "20px",
	color: "#828F8F",
	cursor: "pointer",
	margin: "-2px",
};
