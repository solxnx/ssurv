import './App.css';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import { Button, Tooltip } from "@mui/material";
import { allSkills } from './allSkills';
import { allHeroes } from './allHeroes';

/* START MobX BLOCK */
const store = observable({
  pool: [],
  limit: 6,
  generalistCount: [0, 0, 0, 0],
  synchronyCount: [0, 0, 0, 0],
  runes: {extra: false, minus: false, generalist: false, synchrony: false},
  icons: {debuffs: true, buffs: true, traits: false, types: false},
  filter: 'All',
  changeFilter (val)  {
    this.filter = val;
  },
  showIcons (val)  {
    this.icons[val] = !this.icons[val];
  },
  runeSwitch (val) {
    this.runes[val] = !this.runes[val];
    switch (val) {
      case 'extra': this.runes['extra'] ? this.limit += 1 : this.limit -= 1; break;
      case 'minus': this.runes['minus'] ? this.limit -= 3 : this.limit += 3; break;
      case 'generalist': if (this.runes['generalist']) this.generalist(1, 4); break;
      case 'synchrony': if (this.runes['synchrony']) this.synchrony(1, 4); break;
      default: break;
    }
  },
  generalist (stage, stageEnd)  {
    if (stage !== 5 && this.runes['generalist']) {
      for (let i = stage; i <= stageEnd; i++) {
        let typesPool = [];
        this.pool.forEach((e) =>  {
          if (e.stage === i) typesPool = [...new Set(typesPool.concat(e.allTypes))];
        })
        this.generalistCount[i-1] = typesPool.length*1.5;
      }
    }
  },
  synchrony (stage, stageEnd)  {
    if (stage !== 5 && this.runes['synchrony'])  {
      for (let i = stage; i <= stageEnd; i++) {
        this.synchronyCount[i-1] = 0;
        let result = {};
        this.pool.forEach((e) => {
          if (e.stage === i) {
            e.allTypes.forEach((a) => result[a] = result[a] + 1 || 1);
          }
        });
        for (let val in result) {
          if (result[val] >= 2) this.synchronyCount[i-1] += (result[val]-1)*0.7;
        }
        if (this.synchronyCount[i-1] > 20) this.synchronyCount[i-1] = 20;
      }
    }
  },
  add (name, arr) {
    if (this.pool.every((e) => e.name !== name.name)) {
      for (let i = 1; i <= 4; i++)  {
        if (this.pool.filter((e) => e.stage === i).length < this.limit) {
          this.pool.push({...name, arr: arr, stage: i});
          allSkills.get(name.name).opacity = 0.2;
          if (this.runes['generalist']) this.generalist(i, i);
          if (this.runes['synchrony']) this.synchrony(i, i);
          break;
        }
      }
    }
  },
  delete (name, stage)  {
    this.pool = this.pool.filter((e) => e.name !== name);
    allSkills.get(name).opacity = 1;
    if (this.runes['generalist']) this.generalist(stage, stage);
    if (this.runes['synchrony']) this.synchrony(stage, stage);
  },
  banish (name, arr) {
    if (this.pool.filter((e) => e.stage === 5).length < 10 && this.pool.every(e => e.name !== name.name))  {
      this.pool.push({...name, arr: arr, stage: 5});
      allSkills.get(name.name).opacity = 0.2;
    }
  },
  reset ()  {
    this.pool = [];
    this.generalistCount = this.synchronyCount = [0, 0, 0, 0];
    allSkills.forEach((e) => e.opacity = 1);
  },

});
/* END MobX BLOCK */ 

/* START COMPONENTS BLOCK */
function Skills ({arr}) {
  let arrType;
  if (arr === "weapons") arrType = allHeroes.get(store.filter).wArray;
  if (arr === "skills") arrType = allHeroes.get(store.filter).sArray;
  return  (
    arrType.map((e, idx) => {
      const getSkill = allSkills.get(e);
      return (
        <div key={idx} style={{textAlign: "center", marginRight: "10px", marginBottom: "15px", opacity: allSkills.get(e).opacity}}>
          <Tooltip placement="top" title={<span className="tooltipInfo">{getSkill.name}</span>} followCursor>
            <Button variant="text" size="medium" className='allImgs'
            style={{backgroundImage: `url('/img/${arr}/${getSkill.name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
            onClick={() => store.add(getSkill, arr)}
            onContextMenu={() => store.banish(getSkill, arr)}>
            {store.icons['types'] &&
            <div style={{position: "absolute", right: "-15%", top: "-15%"}}>
              {getSkill.types.map((b, ix) => {
                return <img key={ix} width="25px" height="25px" src={`img/types/${b}.png`} title={b} alt="no" />
              })}
            </div>}
            </Button>
          </Tooltip>
          {(store.icons['debuffs'] && getSkill.hasOwnProperty('debuffs')) &&
          <div className='buffDiv'>
            {getSkill.debuffs.map((b, ix) => {
              return <img key={ix} width="60px" height="60px" src={`/img/debuffs/${b}.png`} title={b} alt="no"/>
            })}
          </div>}
          {(store.icons['buffs'] && getSkill.hasOwnProperty('buffs')) &&
          <div className='buffDiv'>
            {getSkill.buffs.map((b, ix) => {
              return <img key={ix} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
            })}
          </div>}
          {(store.icons['traits'] && getSkill.hasOwnProperty('traits')) &&
          <div className='buffDiv' style={{marginTop: "-3px"}}>
            {getSkill.traits.map((b, ix) => {
              return <img key={ix} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
            })}
          </div>}
        </div>
      )
    })
  )
}

function Stage ({num}) {
  return (
    <>
      {num !== 5 
        ? <div className='title'>{'Stage ' + num} ({store.pool.filter((e) => e.stage === num).length} / {store.limit})</div>
        : <div className='title'>Banished ({store.pool.filter((e) => e.stage === 5).length} / 10)</div>}
      <div style={{display: "flex", justifyContent: "center", fontSize: "15pt", marginBottom: "5px"}}>
        {(store.runes['generalist'] && num !== 5) && <div style={{color: "yellow", marginRight: "10px"}}>+ {store.generalistCount[num-1]}% dmg</div>}
        {(store.runes['synchrony'] && num !== 5) && <div style={{color: "aqua"}}>+ {store.synchronyCount[num-1].toFixed(1)}% dmg</div>}
      </div>
      <div className='stages'>
        {store.pool.filter((e) => e.stage === num).map((i, idx) => {
          return  (
            <div key={idx} style={{textAlign: "center", marginRight: "5px", marginBottom: "5px"}}>
              <Tooltip placement="top" title={<span className="tooltipInfo">{i.name}</span>} followCursor>
                <Button variant="text" size="medium" className='allImgs'
                style={{backgroundImage: `url('/img/${i.arr}/${i.name.replaceAll(' ', '')}.webp')`, backgroundSize: "cover", height:"65px"}}
                onClick={() => store.delete(i.name, num)}>
                {store.icons['types'] &&
                <div style={{position: "absolute", right: "-8%", top: "-15%"}}>
                  {i.types.map((b, ix) => {
                    return <img key={ix} width="25px" height="25px" src={`img/types/${b}.png`} title={b} alt="no" />
                  })}
                </div>}
                </Button>
              </Tooltip>
              {(store.icons['debuffs'] && i.hasOwnProperty('debuffs')) &&
              <div className='buffDiv'>
                {i.debuffs.map((b, ix) => {
                  return <img key={ix} width="60px" height="60px" src={`/img/debuffs/${b}.png`} title={b} alt="no"/>
                })}          
              </div>}
              {(store.icons['buffs'] && i.hasOwnProperty('buffs')) &&
              <div className='buffDiv'>
                {i.buffs.map((b, ix) => {
                  return <img key={ix} width="60px" height="60px" src={`/img/buffs/${b}.png`} title={b} alt="no"/>
                })}          
              </div>}
              {(store.icons['traits'] && i.hasOwnProperty('traits')) &&
              <div className='buffDiv' style={{marginTop: "-3px"}}>
                {i.traits.map((b, ix) => {
                  return <img key={ix} width="60px" height="60px" src={`/img/traits/${b}.png`} title={b} alt="no"/>
                })}
              </div>}
            </div>
          )
        })}
      </div>
    </>
  )
}
/* END COMPONENTS BLOCK */

function App() {

  document.oncontextmenu = () => {
    return false;
  }

  const charactersList = Array.from(allHeroes.keys()).map((i, idx) => {
    return (
      <div key={idx} style={{margin: "10px"}}>
        <Tooltip placement="top" title={<span className="tooltipInfo">{i.charAt(0).toUpperCase() + i.slice(1)}</span>} followCursor>
          <label className="heroes">
            <input type='radio' name='filter' value={i} onChange={(e) => store.changeFilter(e.target.value)} />
            <img className='allImgs' src={`/img/heroes/${i}.webp`} alt="no"/>
          </label>
        </Tooltip>
      </div>
    );
  });

  return (
    <>
    <div style={{position: 'absolute', fontSize: '10pt'}}>Alpha Test - EA Update 13g</div>
    <div className="mainTitle" align="center">Soulstone Survivors The Unholy Cathedral Build Planner by Solxnx</div>
      <div className="parent">
        <div className='left'>
          <div className='cList'>{charactersList}</div>
          {(store.filter !== "All") && 
          <div className='rList'>
            <Tooltip placement="top" title={<span className="tooltipInfo">Improved Repetory</span>} followCursor>
              <label className='runeLabel'>
                <input type="checkbox" checked={store.runes['extra']} onChange={() => store.runeSwitch("extra")} />
                <img src={`/img/runes/ImprovedRepetory.png`} alt="no" />
              </label>
            </Tooltip>
            <Tooltip placement="top" title={<span className="tooltipInfo">Focused Mind</span>} followCursor>
              <label className='runeLabel'>
                <input type="checkbox" checked={store.runes['minus']} onChange={() => store.runeSwitch("minus")} />
                <img src={`/img/runes/FocusedMind.png`} alt="no" />
              </label>
            </Tooltip>
            <Tooltip placement="top" title={<span className="tooltipInfo">Generalist</span>} followCursor>
              <label className='runeLabel'>
                <input type="checkbox" checked={store.runes['generalist']} onChange={() => store.runeSwitch("generalist")} />
                <img src={`/img/runes/Generalist.png`} alt="no" />
              </label>
            </Tooltip>
            <Tooltip placement="top" title={<span className="tooltipInfo">Synchrony</span>} followCursor>
              <label className='runeLabel'>
                <input type="checkbox" checked={store.runes['synchrony']} onChange={() => store.runeSwitch("synchrony")} />
                <img src={`/img/runes/Synchrony.png`} alt="no" />
              </label>
            </Tooltip>
          </div>}
        </div>
        <div className='center'>
          {(store.filter !== "All") && 
            <div className='stack'>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.icons['debuffs']} onChange={() => store.showIcons("debuffs")} />
                <span>Debuffs</span>
              </label>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.icons['buffs']} onChange={() => store.showIcons("buffs")} />
                <span>Stackable Buffs</span>
              </label>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.icons['traits']} onChange={() => store.showIcons("traits")} />
                <span>Traits</span>
              </label>
              <label className='iconsLabel'>
                <input style={{width: "16pt", height: "16pt"}} type="checkbox" checked={store.icons['types']} onChange={() => store.showIcons("types")} />
                <span>Skill Types</span>
              </label>
            </div>}
          {(store.filter === "All") && <div style={{fontSize: "35px", textAlign: "center"}}>Choose your character</div>}
          {(store.filter !== "All") && <div style={{marginBottom: "10px"}} className="items"><Skills arr={"weapons"} /></div>}
          {(store.filter !== "All") && <div className="items"><Skills arr={"skills"} /></div>}
        </div>
        <div className='right'>
          <Stage num={1} />
          <Stage num={2} />
          <Stage num={3} />
          <Stage num={4} />
          <Stage num={5} />
          {(store.pool.length > 0) && 
          <div>
            <Button style={{marginTop: "10px"}} color="error" onClick={() => store.reset()} variant='contained'>RESET BUILD</Button>
          </div>}
        </div>
      </div>
    </>
  );
}
export default observer(App);