import TestButton from "./TestButton";

export default {
    title: "Button",
    component: TestButton,
    args: {
        label: "Demo Button"
    }
};

const Template = args => <TestButton {...args} />;

const Standard = Template.bind({});

const Disabled = Template.bind({});
Disabled.args = { disabled: true, label: "Disabled Button" };

export { Standard, Disabled };