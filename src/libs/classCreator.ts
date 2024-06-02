export type ClassType = {
    name: string;
    ancestors: string[];
    attributes: string[];
}[];

export type InstanceMap = {
    [key: string]: { classname: string, attributes: string[] };
};

export type InstanceByClassnames = {
    [key: string]: { name: string, attributes: string[] }[];
};

export class Sneps {
    private classes: ClassType;
    private instances: InstanceMap;

    constructor(classes: ClassType) {
        this.classes = classes;
        this.instances = {};

        this.drillAttributes()
    }

    drillAttributes() {
        for(const cl of this.classes) {
            for(const anc of cl.ancestors) {
                cl.attributes.push(...(this.classes.find(x => x.name === anc) ?? { attributes: [] }).attributes)
                cl.attributes = cl.attributes.filter((attr, i, self) => self.findIndex(v => v === attr) === i)
            }
        }
    }

    // if the instance inst belongs to class cl
    belogsTo(inst: string[], cl: ClassType[number]) {
        return cl.attributes.every(a => inst.includes(a))
    }

    // Creates a new instance with instancename of class classname
    instance(instancename: string, attributes: string[]) {
        // Check if the classname exists in the classes list
        let classname = "";
        for (let c of this.classes) {
            if (this.belogsTo(attributes, c)) {
                classname = c.name
                break;
            }
        }
        if (!classname) {
            this.instances[instancename] = { classname: 'Без класса', attributes }
            return
        }
        // Register the instance along with its class
        this.instances[instancename] = { classname, attributes };
    }

    private findClassByName(name: string): { name: string; ancestors: string[] } | undefined {
        for (let c of this.classes) {
            if (c.name === name) {
                return c;
            }
        }
        return undefined;
    }

    private static findClassByName(name: string, classes: ClassType): { name: string; ancestors: string[] } | undefined {
        for (let c of classes) {
            if (c.name === name) {
                return c;
            }
        }
        return undefined;
    }

    // Check if the given instancename is an instance or descendant of the classname
    isDescendant(instancename: string, classname: string): boolean {
        const instanceClass = this.instances[instancename].classname;
        
        if (!instanceClass) {
            throw new Error(`Instance ${instancename} does not exist.`);
        }

        // Use Depth-First Search (DFS) to check for ancestor relationship
        const stack: string[] = [instanceClass];
        const visited: { [key: string]: boolean } = {};

        while (stack.length > 0) {
            const currentClass = stack.pop();

            if (currentClass === classname) {
                return true;
            }

            if (currentClass && !visited[currentClass]) {
                visited[currentClass] = true;

                const currentClassData = this.findClassByName(currentClass);
                if (currentClassData) {
                    stack.push(...currentClassData.ancestors);
                }
            }
        }

        return false;
    }

    // Check if the given class1 is a descendant of the class2 in classes
    static isDescendant(class1: string, class2: string, classes: ClassType): boolean {
        // Use Depth-First Search (DFS) to check for ancestor relationship
        const stack: string[] = [class1];
        const visited: { [key: string]: boolean } = {};

        while (stack.length > 0) {
            const currentClass = stack.pop();

            if (currentClass === class2) {
                return true;
            }

            if (currentClass && !visited[currentClass]) {
                visited[currentClass] = true;

                const currentClassData = Sneps.findClassByName(currentClass, classes);
                if (currentClassData) {
                    stack.push(...currentClassData.ancestors);
                }
            }
        }

        return false;
    }

    // get instances by classnames
    getInstances() {
        const res: InstanceByClassnames = {} // array of instances of the class
        for (const [instanceName, { classname, attributes }] of Object.entries(this.instances)) {
            if (classname === 'Без класса') {
                res[classname] = (res[classname] ?? [])
                res[classname].push({ name: instanceName, attributes })
            }
            for (const cl of this.classes) {
                if (this.belogsTo(attributes, cl)) {
                    res[cl.name] = (res[cl.name] ?? [])
                    res[cl.name].push({ name: instanceName, attributes })
                }
            }
        }
        return res
    }
}

// const classList: ClassType = [
//     { name: 'Животное', ancestors: [], attributes: ['Дышит'] },
//     { name: 'Млекопитающее', ancestors: ['Животное'], attributes: ['Дышит', '4 ноги'] },
//     { name: 'Человек', ancestors: ['Млекопитающее'], attributes: ['Дышит', '4 ноги', 'Прямоходящий'] },
//     { name: 'Кот', ancestors: ['Млекопитающее'], attributes: ['Дышит', '4 ноги', 'Есть хвост']}
// ];

// const sneps = new Sneps(classList);

// // Теперь пробрасываем атрибуты
// sneps.instance('Аристотель', ['Дышит', '4 ноги', 'Прямоходящий', 'Лысый']);

// // Проверяем принадлежность классу именно сравнивая атрибуты инстанса и атрибуты класса
// console.log(sneps.isDescendant('Аристотель', 'Человек')); // true
// console.log(sneps.isDescendant('Аристотель', 'Млекопитающее')); // true
// console.log(sneps.isDescendant('Аристотель', 'Кот')); // false

// sneps.instance('Мутант Барсик', ['Дышит', '4 ноги'])
// console.log(sneps.isDescendant('Мутант Барсик', 'Кот')) // false
// console.log(sneps.isDescendant('Мутант Барсик', 'Млекопитающее')) // true

// sneps.instance('Мутант Барсик', ['Дышит', '4 ноги', 'Есть хвост', 'Очень волосатый']) // Добавили атрибут к существующей сущности
// console.log(sneps.isDescendant('Мутант Барсик', 'Кот')) // true
// console.log(sneps.isDescendant('Мутант Барсик', 'Человек')) // false

// sneps.instance('Мутант Барсик', ['Дышит', 'Есть хвост', 'Очень волосатый']) // Убрали атрибут
// console.log(sneps.isDescendant('Мутант Барсик', 'Кот')) // false
// console.log(sneps.isDescendant('Мутант Барсик', 'Животное')) // true
