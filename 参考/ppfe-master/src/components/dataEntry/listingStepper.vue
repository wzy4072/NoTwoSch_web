<template>
    <div class="stepper-box" :class="{ 'stepper-disabled': disabled }">
        <button
            class="stepper minus"
            :class="{ 'minus-disabled': isMinusDisabled }"
            @click="onChange('minus')"
        />
        <input
            type="text"
            class="input"
            :value="currentValue"
            :disabled="disabled || disableInput"
            @input="onInput"
        >
        <span class="unit">{{unit}}</span>
        <button
            class="stepper plus"
            :class="{ 'plus-disabled': isPlusDisabled }"
            @click="onChange('plus')"
        />
    </div>
</template>

<script>
    export default {
        props: {
            value: {},
            disabled: Boolean,
            disableInput: {
                type: Boolean,
                default: true
            },
            min: {
                type: [String, Number],
                default: 1
            },
            max: {
                type: [String, Number],
                default: Infinity
            },
            step: {
                type: [String, Number],
                default: 1
            },
            defaultValue: {
                type: [String, Number],
                default: 1
            },
            unit: {
                type: [String],
                default: null
            }
        },
        data() {
            let value = this.value ? +this.value : +this.defaultValue;
            var correctedValue = this.correctValue(value);
            if (value !== correctedValue) {
                value = correctedValue;
                this.$emit('input', value);
            }
            return {
                currentValue: value
            };
        },
        computed: {
            isMinusDisabled() {
                var min = +this.min;
                var step = +this.step;
                var currentValue = +this.currentValue;
                return min === currentValue || (currentValue - step) < min || this.disabled;
            },
            isPlusDisabled() {
                var max = +this.max;
                var step = +this.step;
                var currentValue = +this.currentValue;
                return max === currentValue || (currentValue + step) > max || this.disabled;
            }
        },
        watch: {
            value(val) {
                val = this.correctValue(+val);
                if (val !== this.currentValue) {
                    this.currentValue = val;
                }
            }
        },
        methods: {
            correctValue(value) {
                if (Number.isNaN(value)) {
                    value = this.min;
                } else {
                    value = Math.max(this.min, value);
                    value = Math.min(this.max, value);
                }
                return value;
            },
            onInput(event) {
                var num = event.target.value;
                if(!/^\d*$/.test(num) || num < 0 || num%1 === 0) {
                    event.target.value = 0;
                }
                var val = + num;
                this.currentValue = this.correctValue(val);
                this.emitInput();
            },
            onChange(type) {
                if ((this.isMinusDisabled && type === 'minus') || (this.isPlusDisabled && type === 'plus')) {
                    return;
                }
                var step = +this.step;
                var currentValue = +this.currentValue;
                this.currentValue = type === 'minus' ? (currentValue - step) : (currentValue + step);
                this.emitInput();
                this.$emit(type);
            },
            emitInput() {
                this.$emit('input', this.currentValue);
                this.$emit('change', this.currentValue);
            }
        }
    };
</script>
<style scoped>
    input, button {
        outline: none;
    }
    .minus-disabled {
        background-color: #f8f8f8;
        border-color: #e8e8e8 #ccc #e8e8e8 #e8e8e8;
    }
    .stepper {
        width: 40px;
        height: 30px;
        box-sizing: border-box;
        background-color: #fff;
        border: 1px solid #ccc;
        position: relative;
        padding: 5px;
        vertical-align: middle;
    }
    .minus {
        position: relative;
        left: 4px;
        border-radius: 2px 0 0 2px;
    }
    
    .input {
        width: 33px;
        height: 26px;
        padding: 1px;
        border: 1px solid #ccc;
        border-width: 1px 0;
        border-radius: 0;
        box-sizing: content-box;
        color: #666;
        font-size: 14px;
        vertical-align: middle;
        text-align: center;
        -webkit-appearance: none !important;
        margin: 0;
    }
    .plus {
        position: relative;
        left: -4px;
        border-radius: 0 2px 2px 0;
    }
    .stepper {
        width: 40px;
        height: 30px;
        box-sizing: border-box;
        background-color: #fff;
        border: 1px solid #ccc;
        position: relative;
        padding: 5px;
        vertical-align: middle;
    }
    .stepper::before, .stepper::after {
        content: '';
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #6c6c6c;
    }

    .stepper::after {
        width: 1px;
        height: 9px;
    }
    .stepper::before {
        width: 9px;
        height: 1px;
    }
    .minus::after {
        display: none;
    }
    .minus-disabled, .plus-disabled {
        background-color: #f8f8f8;
    }
</style>