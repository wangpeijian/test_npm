<style lang="scss" scoped>
    .code-generate {
        padding: 20px;

        textarea {
            width: 100%;
        }

        .form-line {
            padding: 20px;
        }

        .factor-list {
            display: block;
            margin: 20px;
        }
    }
</style>

<template>
    <div class="code-generate">
        <div class="form-line">
            <label>计费项</label>
            <input type="text" v-model="priceProductType" placeholder="Price Product Type">
        </div>

        <div class="form-line">
            <label>计费类型</label>
            包费<input type="radio" name="priceType" :value="true" v-model="packagePrice">
            按量<input type="radio" name="priceType" :value="false" v-model="packagePrice">
        </div>

        <div class="form-line">
            <label>exitInfo</label>
            <input type="text" v-model="exitInfo" placeholder="Exit Info">
        </div>

        <div class="form-line">
            <label>单位code</label>
            <input type="text" v-model="priceUnit" placeholder="Price Unit">
        </div>

        <div class="form-line">
            <label>单位名称</label>
            <input type="text" v-model="priceUnitName" placeholder="Price Unit Name">
        </div>

        <div class="form-line">
            <label>公式类型</label>
            <select v-model="ruleCode" placeholder="Rule Code">
                <option value="EXPR">EXPR</option>
                <option value="BRACKET">BRACKET</option>
                <option value="CONST">CONST</option>
                <option value="STEP">STEP</option>
            </select>
        </div>

        <div class="form-line">
            <label>算费公式</label><span>(提示：使用@{key}表示会替换的值)</span>
            <textarea v-model="ruleExpresion" rows="10" placeholder="Rule Expresion"/>
        </div>

        <div class="form-line">
            <button @click="addFactor">添加计费因子</button>

            <div class="factor-list" v-for="(item, index) in factorList" :key="index">
                <input type="text" v-model="item.factorName" placeholder="Factor Name">
                <br>
                <br>
                <textarea v-model="item.factorValues" rows="10" placeholder="Factor Value"/>
                <br>
                <br>
                <textarea v-model="item.prices" rows="10" placeholder="Price Value"/>
            </div>
        </div>

        <div class="form-line">
            <button @click="generate">生成sql</button>
        </div>

        <p>factor_sql</p>
        <textarea id="factor_sql" cols="30" rows="50"></textarea>
        <br>
        <br>
        <p>rule_sql</p>
        <textarea id="rule_sql" cols="30" rows="50"></textarea>
    </div>
</template>

<script lang="ts">
    {
        // @ts-ignore
        Date.prototype.Format = function (fmt: string) {
            const o = {
                'M+': this.getMonth() + 1, // 月份
                'd+': this.getDate(), // 日
                'h+': this.getHours(), // 小时
                'm+': this.getMinutes(), // 分
                's+': this.getSeconds(), // 秒
                'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
                'S': this.getMilliseconds(), // 毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (const k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    // @ts-ignore
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
                }
            }
            return fmt;
        };

        // @ts-ignore
        String.prototype.Format = function (key: string, value: any): string {
            const str = this.valueOf();
            return str.replace(new RegExp('@{' + key + '}', 'g'), value);
        }
    }

    import {Component, Vue, Watch} from 'vue-property-decorator';

    const FactorSQL: string = `INSERT INTO \`dev_baas_bmc1\`.\`cp_pricemaking_factor\` (\`TENANT_ID\`, \`PRICE_PRODUCT_TYPE\`, \`PRICE_PRODUCT_ID\`, \`FACTOR_NAME\`, \`FACTOR_VALUE\`) VALUES ('ECITIC', '@{priceProductType}', '@{priceProductId}', '@{factorName}', '@{factorValue}');\n\r`;

    const RuleSQLPackage: string = `INSERT INTO \`dev_baas_bmc1\`.\`cp_pricemaking_rule\` (\`ID\`, \`TENANT_ID\`, \`PRICE_PRODUCT_TYPE\`, \`PRICE_PRODUCT_ID\`, \`PRICE_TYPE\`, \`RULE_CODE\`, \`RULE_EXPRESION\`, \`EXT_INFO\`, \`PRICE_UNIT\`, \`PRICE_UNIT_NAME\`, \`ACTIVE_TIME\`, \`INACTIVE_TIME\`, \`BILLING_TYPE\`) VALUES ('@{id}', 'ECITIC', '@{priceProductType}', '@{priceProductId}', 'PER_HOUR', '@{ruleCode}', '@{ruleExpresion}', '@{exitInfo}', '@{priceUnit}', '@{priceUnitName}', '2016-01-01 12:00:00', '2099-01-01 12:00:00', 'package');\n\r`;
    const RuleSQLUsage: string = `INSERT INTO \`dev_baas_bmc1\`.\`cp_pricemaking_rule\` (\`ID\`, \`TENANT_ID\`, \`PRICE_PRODUCT_TYPE\`, \`PRICE_PRODUCT_ID\`, \`PRICE_TYPE\`, \`RULE_CODE\`, \`RULE_EXPRESION\`, \`EXT_INFO\`, \`PRICE_UNIT\`, \`PRICE_UNIT_NAME\`, \`ACTIVE_TIME\`, \`INACTIVE_TIME\`, \`BILLING_TYPE\`) VALUES ('@{id}', 'ECITIC', '@{priceProductType}', '@{priceProductId}', 'PER_HOUR', '@{ruleCode}', '@{ruleExpresion}', '@{exitInfo}', '@{priceUnit}', '@{priceUnitName}', '2016-01-01 12:00:00', '2099-01-01 12:00:00', 'usage');\n\r`;


    /**
     * id 生成器
     */
    class IdGenerator {
        private num: number;
        private readonly time: string = '';

        constructor() {
            // @ts-ignore
            this.time = new Date().Format("yyyyMMddhhmmss") * 1000;
            this.num = 0;
        }

        nextId() {
            return `${this.time}${this.num++}`
        }
    }

    @Component({
        components: {},
    })
    export default class extends Vue {
        // 计费项code
        priceProductType: string = '';
        // 算费公式类型
        ruleCode: string = "";
        // 算费公式
        ruleExpresion: string = '';
        // 计费类型
        packagePrice: boolean = true;

        exitInfo: string = 'Period';
        priceUnit: string = '';
        priceUnitName: string = '元';

        factorList = [{
            factorName: '',
            factorValues: '',
            prices: '',
        }];

        addFactor() {
            this.factorList = this.factorList.concat({
                factorName: '',
                factorValues: '',
                prices: '',
            });
        }

        generate() {
            const cartesianRes: any[] = this.generateCartesian();
            const factorSQL = this.generateFactorSQL(cartesianRes);
            const ruleSQL = this.generateRuleSQL(cartesianRes);

            console.log("=============factorSQLCollection 是 factor sql结果：");
            const factorSQLStr = factorSQL.join(" ");
            console.log(factorSQLStr);

            console.log("=============ruleSQLCollection 是 rule sql结果：");
            const ruleSQLStr = ruleSQL.join("");
            console.log(ruleSQLStr);

           document.getElementById("factor_sql").value = factorSQLStr;
           document.getElementById("rule_sql").value = ruleSQLStr;

            // console.log(JSON.stringify(factorSQL));
            // console.log(JSON.stringify(ruleSQL));
        }

        /**
         * 创建笛卡尔积
         */
        generateCartesian(): any[] {
            const cartesianRes = this.factorList.reduce(function (all: any[], cur: any) {
                // 解析当前因子价格
                const priceArr: any[] = cur.prices.split(/\n/).filter((item: any) => !!item);

                // 解析当前因子规格
                const curArray = cur.factorValues.split(/\n/).filter((item: any) => !!item).map((item: any, index: number) => {
                    const prices: any = {};
                    prices[cur.factorName] = priceArr[index] * 1000;

                    return {
                        priceProductId: item,
                        factorValue: [item],
                        factorName: [cur.factorName],
                        prices,
                    }
                });

                if (curArray.length === 0) {
                    return all;
                }

                if (all.length === 0) {
                    return curArray;
                } else {
                    // 开始做笛卡尔积
                    const collection: any[] = [];
                    all.forEach(resItem => {
                        curArray.forEach((curItem: any) => {
                            collection.push({
                                priceProductId: resItem.priceProductId + "#" + curItem.factorValue,
                                factorValue: resItem.factorValue.concat(curItem.factorValue),
                                factorName: resItem.factorName.concat(cur.factorName),
                                prices: {...resItem.prices, ...curItem.prices}
                            });
                        })
                    });

                    return collection;
                }
            }, []);

            console.log("=============cartesianRes 是笛卡尔积后的结果：", cartesianRes);

            return cartesianRes;
        }

        /**
         * 生成计费项sql
         * @param cartesianRes
         */
        generateFactorSQL(cartesianRes: any[]): any[] {
            const factorSQLCollection: any[] = [];

            const priceProductType = this.priceProductType;

            // 根据笛卡尔积 生成sql
            cartesianRes.forEach(factor => {
                const {factorName, factorValue, priceProductId} = factor;

                // @ts-ignore
                const baseSQL = FactorSQL.Format("priceProductId", priceProductId).Format("priceProductType", priceProductType);

                for (let i = 0; i < factorName.length; i++) {
                    const name = factorName[i];
                    const value = factorValue[i];

                    factorSQLCollection.push(
                        baseSQL.Format("factorName", name)
                            .Format("factorValue", value)
                    );
                }
            });

            return factorSQLCollection;
        }

        /**
         * 生成价格公示
         * @param cartesianRes
         */
        generateRuleSQL(cartesianRes: any[]): any[] {
            const idGenerator = new IdGenerator();

            const packagePrice = this.packagePrice;
            const baseSQL = packagePrice ? RuleSQLPackage : RuleSQLUsage;

            const priceProductType = this.priceProductType;
            const ruleCode = this.ruleCode;

            const exitInfo = this.exitInfo;
            const priceUnit = this.priceUnit;
            const priceUnitName = this.priceUnitName;

            const ruleSQLCollection: any[] = [];

            cartesianRes.forEach(factor => {
                const {priceProductId, prices} = factor;
                let ruleExpresion = this.ruleExpresion;

                for (let key in prices){
                    // @ts-ignore
                    ruleExpresion = ruleExpresion.Format(key, prices[key]);
                }

                // @ts-ignore
               const sql =  baseSQL.Format("id", idGenerator.nextId())
                    .Format("priceProductType", priceProductType)
                    .Format("priceProductId", priceProductId)
                    .Format("ruleCode", ruleCode)
                    .Format("ruleExpresion", ruleExpresion)
                    .Format("exitInfo", exitInfo)
                    .Format("priceUnit", priceUnit)
                    .Format("priceUnitName", priceUnitName)
                ;

                ruleSQLCollection.push(sql);

            });

            return ruleSQLCollection;
        }

        @Watch("packagePrice")
        packagePriceChange(packagePrice: boolean) {
            if (packagePrice) {
                this.exitInfo = "Period";
                this.priceUnit = '';
                this.priceUnitName = '元';
            } else {
                this.exitInfo = '';
                this.priceUnit = 'h';
                this.priceUnitName = '元/时';
            }
        }
    }

</script>
