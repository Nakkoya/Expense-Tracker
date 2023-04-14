export const leftBox = {
	display: "flex",
	flexDirection: "column",
	width: { xs: "100%", md: "67%" },
	mr: { xs: 0, md: "10px" },
	borderRadius: "20px",
	padding: "10px",
	overflow: "auto",
	backgroundColor: "#dddddd",
};

export const rightBox = {
	display: "flex",
	flexDirection: "column",
	position: { xs: "static", md: "sticky" },
	top: { xs: "auto", md: "70px" },
	borderRadius: "20px",
	height: "89vh",
	padding: "5px",
	width: { xs: "100%", md: "33%" },
	overflow: "auto",
	backgroundColor: "#dddddd",
	mt: { xs: "20px", md: 0 },
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

export const mainBox = {
	display: "flex",
	flexDirection: { xs: "column", md: "row" },
	borderRadius: "20px",
};
