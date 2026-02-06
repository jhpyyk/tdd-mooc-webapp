import { useState } from "react";

interface CheckboxProps {
    initiallyChecked: boolean;
    onCheckedChange: (newCheckedStatus: boolean) => void;
}

const Checkbox = ({ initiallyChecked, onCheckedChange }: CheckboxProps) => {
    const [checked, setChecked] = useState(initiallyChecked);

    const handleCheckedChange = (newChecked: boolean) => {
        onCheckedChange(newChecked);
        setChecked(newChecked);
    };
    return (
        <div>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => handleCheckedChange(e.target.checked)}
            />
        </div>
    );
};
export default Checkbox;
