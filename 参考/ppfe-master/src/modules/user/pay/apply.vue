<template>
</template>
<script>

export default {
    created() {
        let corporateId = this.$route.params.corporateId;
        let productCode = this.$route.params.code;
        let variationCode = this.$route.params.variationCode;
        let qty = this.$route.params.qty;

        this.$router.push({
            name: 'orderView',
            params: {
                info: JSON.stringify({
                    corporateId: corporateId,
                    code: productCode,
                    variationCode: variationCode,
                    qty: qty,
                    behavior: "ENTERPRISE",
                    currency: "CNY",
                    type: "VOUCHER"
                })
            }
        });

    }
}
</script>