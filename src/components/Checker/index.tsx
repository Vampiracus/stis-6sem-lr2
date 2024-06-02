import { ClassType, Sneps, InstanceByClassnames, InstanceMap } from '@/libs/classCreator'
import React, { useCallback, useRef, useState } from 'react'

export interface CheckerProps {
    classes: ClassType
}

export const Checker = (props: CheckerProps) => {
    const { classes } = props
    
    const sneps = useRef(new Sneps(classes))
    const checkClassRef = useRef<null | HTMLSelectElement>(null)
    const checkInstanceRef = useRef<null | HTMLSelectElement>(null)

    const [instanceName, setinstanceName] = useState("");
    const [isAncestor, setisAncestor] = useState<null | boolean>(null);
    const [instances, setinstances] = useState<InstanceByClassnames>({});

    const addInstance: React.MouseEventHandler<HTMLButtonElement> = e => {
        e.preventDefault()
        sneps.current.instance(instanceName, [])
        setinstances(sneps.current.getInstances())
        setinstanceName("")
    }

    // const check: React.MouseEventHandler<HTMLButtonElement> = e => {
    //     e.preventDefault()
    //     if (!checkInstanceRef.current || !checkClassRef.current) {
    //         return
    //     }
    //     setisAncestor(sneps.current.isDescendant(checkInstanceRef.current.value, checkClassRef.current.value))
    // }

    const addAttr = useCallback((attrSelector: string, instance: { name: string, attributes: string[] }) => {
        const res: React.MouseEventHandler<HTMLButtonElement> = e => {
            e.preventDefault()
            const attrName = (document.querySelector(attrSelector) as null | HTMLInputElement)?.value
            if (!attrName) {
                return
            }
            if (!instance.attributes.includes(attrName)) {
                instance.attributes.push(attrName)
            }
            sneps.current.instance(instance.name, [...instance.attributes])
            setinstances(sneps.current.getInstances())
        }
        return res
    }, [])

    const rmAttr = useCallback((attrName: string, instance: { name: string, attributes: string[] }) => {
        const res: React.MouseEventHandler<HTMLButtonElement> = e => {
            e.preventDefault()
            instance.attributes = instance.attributes.filter(a => a !== attrName)
            sneps.current.instance(instance.name, [...instance.attributes])
            setinstances(sneps.current.getInstances())
        }
        return res
    }, [])

    return (
        <div>
            <h3>Сущности</h3>
            
            <ul>
                { Object.entries(instances).map(([classname, classinstances]) => (
                    <li key={classname}>
                        <span>{classname}</span>
                        <ul>
                            {classinstances.map(inst => (
                                <li key={inst.name}>
                                    <span>{inst.name}</span> <br/>
                                    <span>Атрибуты {inst.attributes.length ? ':' : 'не заданы'}</span>
                                    { inst.attributes.length ? <ul>
                                        {inst.attributes.map(attr => (
                                        <li key={attr}>
                                            <span>{attr}</span>
                                            <button style={{marginLeft: 10}} onClick={rmAttr(attr, inst)}>x</button>
                                        </li>
                                    ))}
                                    </ul> : null}
                                    <form>
                                        <input name='name' placeholder='Говорит по-гречески' title='Добавить атрибут' id={'instance-attribute-input-for-' + inst.name}/>
                                        <button onClick={addAttr('#instance-attribute-input-for-' + inst.name, inst)}>Добавить атрибут</button>
                                    </form>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <h4>Добавить сущность</h4>
            <form>
                <input name='name' placeholder='Аристотель' title='Введите имя сущности' autoFocus value={instanceName} onChange={e => setinstanceName(e.target.value)}/>
                <br/>
                <button onClick={addInstance}>Добавить сущность!</button>
            </form>

            {/* <h4>Проверить сущность</h4>
            <form>
                <select ref={checkInstanceRef} onChange={() => setisAncestor(null)}>
                    { Object.entries(instances).map(([classname, classinstances], index, self) => (
                        <React.Fragment key={classname}>
                            {classinstances.map(i => (
                                self.findIndex(t => t[1].find(x => x.name === i.name)) === index ? <option key={i.name}>{i.name}</option> : null
                            ))}
                        </React.Fragment>
                    ))}
                </select>
                <select ref={checkClassRef} onChange={() => setisAncestor(null)}>
                    { classes.map(cl => (
                        <option key={cl.name}>{cl.name}</option>
                    ))}
                </select>
                <button onClick={check}>Проверить!</button>
            </form> */}
            { isAncestor === null ? null : <p style={{ width: 490 }}>
                {isAncestor 
                    ? `Одим из предков класса сущности "${checkInstanceRef.current?.value}" является класс "${checkClassRef.current?.value}"`
                    : `Среди предков класса сущности "${checkInstanceRef.current?.value}" нет класса "${checkClassRef.current?.value}"` }
                </p> }
        </div>
    )
}
