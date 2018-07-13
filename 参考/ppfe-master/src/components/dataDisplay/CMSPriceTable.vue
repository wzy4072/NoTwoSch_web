<template>
    <div id="price-table">
        <div>
            <table>
                <thead>
                <tr>
                    <th>单位（￥）</th>
                    <th>免费版</th>
                    <th>团队版（8人）</th>
                    <th>团队版（15人）</th>
                    <th>团队版（30人）</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>月付</td>
                    <td>0</td>
                    <td>999</td>
                    <td>1999</td>
                    <td>3999</td>
                </tr>
                <tr class="table-stress">
                    <td>年付（推荐）</td>
                    <td>0</td>
                    <td>6999</td>
                    <td>12999</td>
                    <td>19999</td>
                </tr>
                <tr>
                    <td>年付每月只需</td>
                    <td>0</td>
                    <td>583</td>
                    <td>1083</td>
                    <td>1667</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>
    #price-table > div {
        padding-top: 40px;
        margin: 0 auto;
    }
    #price-table table {
        width: 97%;
    }
    #price-table th, #price-table td {
        width: 240px;
        height: 50px;
        font-size: 16px;
        font-weight: normal;
        text-align: center;
        color: #666;
    }
    #price-table th {
        color: #333;
        background-color: #f2f9fc;
    }
    #price-table .table-stress td {
        color: #00aee0;
    }
</style>