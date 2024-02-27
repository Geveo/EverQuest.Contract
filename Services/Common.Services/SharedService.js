export class SharedService {
    static context = null;

    static async generateSeededRandom(seed, min, max) {
        const hpconfig = await this.context.getConfig();
        const unlSize = this.context.unl.count();

        const timeoutMs = Math.ceil(hpconfig.consensus.roundtime / 2);
        let completed = false;

        // Start listening to incoming NPL messages
        const promise = new Promise((resolve, reject) => {
            let receivedNos = [];

            function getMax() {
                let max = 0;
                for (const randomNumber of receivedNos) {
                    if (randomNumber > max) {
                        max = randomNumber;
                    }
                }
                return max;
            }

            let timer = setTimeout(() => {
                clearTimeout(timer);
                completed = true;

                if (receivedNos.length < unlSize) {
                    reject("Error generating the random number");
                }
                else {
                    resolve(getMax());
                }
            }, timeoutMs);

            SharedService.context.unl.onMessage((node, msg) => {
                if (!completed) {
                    const obj = JSON.parse(msg.toString());
                    if (obj.key === "randomNumber") {
                        const number = Number(obj.value);
                        receivedNos.push(number);
                    }
                    if (receivedNos.length === unlSize) {
                        clearTimeout(timer);
                        completed = true;
                        resolve(getMax());
                    }
                }
            });
        });

        seed = (seed % 1e10 + 1e10) % 1e10;

        let num = Math.sin(seed) * 10000;
        num -= Math.floor(num);

        let random = Math.floor(num * (max - min + 1)) + min;

        await SharedService.context.unl.send(
            JSON.stringify({
                key: "randomNumber",
                value: random,
            })
        );

        return await promise;
    }
}