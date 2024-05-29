import { ClassType, Sneps, InstanceByClassnames } from '@/libs/classCreator'
import React, { useRef, useState } from 'react'

export interface CheckerProps {
    classes: ClassType
}

const selectClass = 'Выберите класс сущности'

export const Checker = (props: CheckerProps) => {
    const { classes } = props
    
    const sneps = useRef(new Sneps(classes))
    const classSelect = useRef<null | HTMLSelectElement>(null)
    const checkClassRef = useRef<null | HTMLSelectElement>(null)
    const checkInstanceRef = useRef<null | HTMLSelectElement>(null)

    const [instanceName, setinstanceName] = useState("");
    const [isAncestor, setisAncestor] = useState<null | boolean>(null);
    const [instances, setinstances] = useState<InstanceByClassnames>({});

    const addInstance: React.MouseEventHandler<HTMLButtonElement> = e => {
        e.preventDefault()
        if (!classSelect.current || classSelect.current.value === selectClass) {
            return
        }
        sneps.current.instance(classSelect.current.value, instanceName)
        setinstances(sneps.current.getInstances())
        setinstanceName("")
    }

    const check: React.MouseEventHandler<HTMLButtonElement> = e => {
        e.preventDefault()
        if (!checkInstanceRef.current || !checkClassRef.current) {
            return
        }
        setisAncestor(sneps.current.isDescendant(checkInstanceRef.current.value, checkClassRef.current.value))
    }

    return (
        <div>
            <h3>Сущности</h3>
            <ul>
                { Object.entries(instances).map(([classname, classinstances]) => (
                    <li key={classname}>
                        <span>{classname}</span>
                        <ul>
                            {classinstances.map(i => (
                                <li key={i}>{i}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            <h4>Добавить сущность</h4>
            <form>
                <input name='name' placeholder='Аристотель' title='Введите имя сущности' autoFocus value={instanceName} onChange={e => setinstanceName(e.target.value)}/>
                <br/>
                <select defaultValue={selectClass} ref={classSelect}>
                    <option disabled>{selectClass}</option>
                    { classes.map(cl => (
                        <option key={cl.name}>
                            {cl.name}
                        </option>
                    ))}
                </select>
                <button onClick={addInstance}>Добавить сущность!</button>
            </form>
            <h4>Проверить сущность</h4>
            <form>
                <select ref={checkInstanceRef} onChange={() => setisAncestor(null)}>
                    { Object.entries(instances).map(([classname, classinstances]) => (
                        <React.Fragment key={classname}>
                            {classinstances.map(i => (
                                <option key={i}>{i}</option>
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
            </form>
            { isAncestor === null ? null : <p style={{ width: 490 }}>
                {isAncestor 
                    ? `Одим из предков класса сущности "${checkInstanceRef.current?.value}" является класс "${checkClassRef.current?.value}"`
                    : `Среди предков класса сущности "${checkInstanceRef.current?.value}" нет класса "${checkClassRef.current?.value}"` }
                </p> }
        </div>
    )
}
