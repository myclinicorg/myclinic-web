import { type AddressField, UFS } from '@/app/lib/definitions';
import { SelectField, TextField } from '@/app/ui/form-fields';

export default function AddressFields({
  values,
  errors,
}: {
  values: Partial<Record<AddressField, string>>;
  errors?: Partial<Record<AddressField, string[]>>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-6">
      <div className="sm:col-span-2">
        <TextField
          id="zipCode"
          name="zipCode"
          label="CEP"
          placeholder="00000-000"
          inputMode="numeric"
          autoComplete="postal-code"
          defaultValue={values.zipCode}
          errors={errors?.zipCode}
        />
      </div>
      <div className="sm:col-span-4">
        <TextField
          id="street"
          name="street"
          label="Rua"
          autoComplete="address-line1"
          maxLength={120}
          defaultValue={values.street}
          errors={errors?.street}
        />
      </div>
      <div className="sm:col-span-2">
        <TextField
          id="streetNumber"
          name="streetNumber"
          label="Número"
          maxLength={20}
          defaultValue={values.streetNumber}
          errors={errors?.streetNumber}
        />
      </div>
      <div className="sm:col-span-4">
        <TextField
          id="addressComplement"
          name="addressComplement"
          label="Complemento"
          placeholder="Sala, andar, bloco…"
          autoComplete="address-line2"
          maxLength={80}
          defaultValue={values.addressComplement}
          errors={errors?.addressComplement}
        />
      </div>
      <div className="sm:col-span-2">
        <TextField
          id="neighborhood"
          name="neighborhood"
          label="Bairro"
          maxLength={80}
          defaultValue={values.neighborhood}
          errors={errors?.neighborhood}
        />
      </div>
      <div className="sm:col-span-3">
        <TextField
          id="city"
          name="city"
          label="Cidade"
          autoComplete="address-level2"
          maxLength={80}
          defaultValue={values.city}
          errors={errors?.city}
        />
      </div>
      <div className="sm:col-span-1">
        <SelectField
          key={values.state}
          id="state"
          name="state"
          label="UF"
          required={false}
          defaultValue={values.state ?? ''}
          errors={errors?.state}
        >
          <option value="">—</option>
          {UFS.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </SelectField>
      </div>
    </div>
  );
}
