type ClassType = {
    name: string;
    ancestors: string[];
}[];

type InstanceMap = {
    [key: string]: string;
};

class Sneps {
    private classes: ClassType;
    private instances: InstanceMap;

    constructor(classes: ClassType) {
        this.classes = classes;
        this.instances = {};
    }

    // Creates a new instance with instancename of class classname
    instance(classname: string, instancename: string) {
        // Check if the classname exists in the classes list
        let classExists = false;
        for (let c of this.classes) {
            if (c.name === classname) {
                classExists = true;
                break;
            }
        }
        if (!classExists) {
            throw new Error(`Class ${classname} does not exist.`);
        }
        // Register the instance along with its class
        this.instances[instancename] = classname;
    }

    private findClassByName(name: string): { name: string; ancestors: string[] } | undefined {
        for (let c of this.classes) {
            if (c.name === name) {
                return c;
            }
        }
        return undefined;
    }

    // Check if the given instancename is an instance or descendant of the classname
    isDescendant(instancename: string, classname: string): boolean {
        const instanceClass = this.instances[instancename];
        
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
}

// const classList: ClassType = [
//     { name: 'Animal', ancestors: [] },
//     { name: 'Mammal', ancestors: ['Animal'] },
//     { name: 'Bird', ancestors: ['Animal'] },
//     { name: 'Dog', ancestors: ['Mammal'] },
//     { name: 'Cat', ancestors: ['Mammal'] }
// ];

// const sneps = new Sneps(classList);

// sneps.instance('Dog', 'Rex');
// console.log(sneps.isDescendant('Rex', 'Mammal')); // true
// console.log(sneps.isDescendant('Rex', 'Animal')); // true
// console.log(sneps.isDescendant('Rex', 'Bird')); // false


const classList: ClassType = [
    { name: 'Animals', ancestors: [] },
    { name: 'Dogs', ancestors: ['Animals'] },
    { name: 'Sheperds', ancestors: ['Dogs'] },
    { name: 'Cats', ancestors: ['Животные'] },
    { name: 'DogCats', ancestors: ['Cats', 'Dogs'] }
];

const sneps = new Sneps(classList);

sneps.instance('Dogs', 'Sharik')

console.log(sneps.isDescendant('Sharik', 'Animals')) // true
console.log(sneps.isDescendant('Sharik', 'Dogs')) // true
console.log(sneps.isDescendant('Sharik', 'Cats')) // false

sneps.instance('DogCats', 'DogCat')

console.log(sneps.isDescendant('DogCat', 'Animals')) // true
console.log(sneps.isDescendant('DogCat', 'Dogs')) // true
console.log(sneps.isDescendant('DogCat', 'Cats')) // true
console.log(sneps.isDescendant('DogCat', 'DogCats')) // true

// Нужно реагировать на некорректные запросы
console.log(sneps.isDescendant('Unknown', 'Animals')) // exception