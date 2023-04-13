export const leftBox = {
	display: "flex",
	flexDirection: "column",
	width: { xs: "100%", md: "67%" },
	mr: { xs: 0, md: "10px" },
};

export const rightBox = {
	display: "flex",
	flexDirection: "column",
	position: { xs: "static", md: "sticky" },
	top: { xs: "auto", md: "70px" },
	border: "solid 0px",
	borderRadius: "0px",
	height: "89vh",
	padding: "2px",
	width: { xs: "100%", md: "33%" },
	overflow: "auto",
};

export const list = {
	mt: "3px",
	padding: 0,
	borderRadius: "20px",
	maxWidth: "100%",
	bgcolor: "background.paper",
	overflow: "auto",
	maxHeight: "44vh",
	"& ul": { padding: 0 },
};
