interface CheckboxProps {
    checked: boolean;
    setChecked: (newCheckedStatus: boolean) => void;
}

const Checkbox = ({ checked, setChecked }: CheckboxProps) => {
    return (
        <div>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
            />
        </div>
    );
};
export default Checkbox;
