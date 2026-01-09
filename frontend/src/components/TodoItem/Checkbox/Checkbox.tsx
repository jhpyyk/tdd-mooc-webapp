interface CheckboxProps {
    checked: boolean;
    setChecked: () => void;
}

const Checkbox = ({ checked, setChecked }: CheckboxProps) => {
    return (
        <div>
            <input type="checkbox" checked={checked} onChange={setChecked} />
        </div>
    );
};
export default Checkbox;
