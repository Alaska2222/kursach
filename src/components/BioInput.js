export default function BioInput({ Label, Name, Type, Id, Disabled, onClick, invalid }) {

    
    return (
      <>
      {!invalid ? (
      <div className="bio-input">
        <label htmlFor={Id}>{Label}:</label>
        <input
          className="input"
          placeholder={Name}
          type={Type}
          id={Id}
          value={Name}
          name={Id}
          disabled={Disabled}
          onChange={onClick}
        />
      </div>):
      (
      <div className="bio-input" id="bio-invalid">
        <label htmlFor={Id}>{Label}:</label>
        <input
          className="input"
          placeholder={Name}
          type={Type}
          id={Id}
          value={Name}
          name={Id}
          disabled={Disabled}
          onChange={onClick}
        />
      </div>

      )}
      </>
    );
  }
  