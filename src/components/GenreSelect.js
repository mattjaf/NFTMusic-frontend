import React from "react";
import { Select } from "antd";

const { Option } = Select;

const genreOptions = [
    { value: "pop", label: "Pop" },
    { value: "rock", label: "Rock" },
    { value: "hiphop", label: "Hip hop" },
    { value: "country", label: "Country" },
    { value: "jazz", label: "Jazz" },
    { value: "classical", label: "Classical" },
    { value: "blues", label: "Blues" },
    { value: "reggae", label: "Reggae" },
    { value: "metal", label: "Metal" },
    { value: "electronic", label: "Electronic" },
    { value: "folk", label: "Folk" },
    { value: "rnb", label: "R&B" }
];

function GenreSelect(props) {
    const handleFilterOption = (input, option) => {
        return (
            option?.label?.toLowerCase()?.includes(input.toLowerCase()) ||
            option?.value?.toLowerCase()?.includes(input.toLowerCase())
        );
    };

    return (
        <Select
            style={{ width: 203 }}
            {...props}
            showSearch
            filterOption={handleFilterOption}
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            placeholder="Select a genre"
        >
            {genreOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                    {option.label}
                </Option>
            ))}
        </Select>
    );
}

export default GenreSelect;