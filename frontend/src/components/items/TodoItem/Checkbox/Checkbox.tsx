import { useState } from "react";

interface CheckboxProps {
    initiallyChecked: boolean;
    onCheckedChange: (newCheckedStatus: boolean) => void;
    disabled?: boolean;
}

const Checkbox = ({
    initiallyChecked,
    onCheckedChange,
    disabled = false,
}: CheckboxProps) => {
    const [checked, setChecked] = useState(initiallyChecked ?? false);

    const handleCheckedChange = (newChecked: boolean) => {
        onCheckedChange(newChecked);
        setChecked(newChecked);
    };
    return (
        <div>
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(e) => handleCheckedChange(e.target.checked)}
            />
        </div>
    );
};
export default Checkbox;
