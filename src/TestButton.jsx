const styles = {
    background: "#fff",
    border: "0.2rem solid #0099ff",
    color: "#0099ff",
    letterSpacing: "0.1em",
    fontWeight: "bold",
    padding: "1em",
    textTransform: "uppercase"
};

const TestButton = ({disabled, label, onClick}) => (
    <button disabled={(disabled ? "true" : "")} onClick={onClick} style={styles}>
        {label}
    </button>
);

export default TestButton;