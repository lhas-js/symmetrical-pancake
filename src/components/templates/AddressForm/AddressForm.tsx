import { Button } from "components/atoms/Button/Button";
import { ButtonGroup } from "components/atoms/ButtonGroup/ButtonGroup";
import { Card, CardBody, CardDivider } from "components/atoms/Card/Card";
import { ContainedButton } from "components/atoms/ContainedButton/ContainedButton";
import { Container } from "components/atoms/Container/Container";
import { Checkbox } from "components/molecules/Checkbox/Checkbox";
import { PageTitle } from "components/molecules/PageTitle/PageTitle";
import { SelectField } from "components/molecules/SelectField/SelectField";
import { TextField } from "components/molecules/TextField/TextField";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useAppSelector } from "hooks/useAppSelector";
import { useCities } from "hooks/useCities";
import { useStates } from "hooks/useStates";
import { useZipcode } from "hooks/useZipcode";
import { useEffect, useRef, useState } from "react";
import { Field } from "react-final-form";
import { actions as flagsActions } from "store/slices/flags";
import { actions as locationsActions } from "store/slices/locations";
import styled from "styled-components";

const InnerContainer = styled.div`
  width: 100%;
  align-self: flex-start;
`;

const InnerContainerMargin = styled.div`
  padding: 16px;
`;

const CEP_LENGTH = 9;

export const AddressForm = ({ onSubmit, form }: any) => {
  const { batch, change } = form;
  const { fetchZipcode, hasError, setHasError } = useZipcode();
  const { fetchCities } = useCities();
  const [zipcode, setZipcode] = useState("");

  const zipcodeRef = useRef<HTMLInputElement>();
  const isFormValid = zipcode.length === 9;

  useStates();

  const dispatch = useAppDispatch();
  const { states, cities } = useAppSelector((state) => state.locations);
  const loading = useAppSelector((state) => state.loading);
  const { displayFields, addManually, agreement } = useAppSelector(
    (state) => state.flags
  );

  const setFlagValue = (flag: string, value: boolean) =>
    dispatch(flagsActions.setFlagValue({ flag, value }));

  const handleZipcode = (event: any) => {
    const value = event.target.value;
    const isValid = value.length === CEP_LENGTH;

    if (!isValid) {
      return false;
    }

    setZipcode(value);
    setFlagValue("displayFields", true);
  };

  const handleCheckbox = () => {
    setFlagValue("agreement", !agreement);
  };

  const handleAddMore = () => {
    setFlagValue("addManually", true);
    setFlagValue("displayFields", true);
  };

  const handleCancel = () => {
    setZipcode("");
    setHasError(false);
    dispatch(
      locationsActions.setLocationValue({ location: "cities", value: [] })
    );
    dispatch(flagsActions.clear());
    form.reset();

    if (zipcodeRef.current) {
      zipcodeRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!zipcode) return;

    const cb = async () => {
      const data = await fetchZipcode(zipcode);
      const uf = states.find((item: any) => item.value === data.uf);
      const city = await fetchCities(uf, data);

      batch(() => {
        change("address", data.logradouro);
        change("neighbourhood", data.bairro);
        change("state", data.uf);
        change("city", city.id);
      });
    };

    cb();
  }, [zipcode, states, batch, change, fetchCities, fetchZipcode]);

  return (
    <form onSubmit={onSubmit}>
      <Container>
        <PageTitle
          mt={[null, null, 40]}
          maxWidth={[null, null, 310]}
          title="Qual o seu endereço?"
          description="Informe um CEP válido para buscarmos seu endereço, ou adicione-o manualmente."
          icon="QuestionIcon"
        />
        <InnerContainer>
          <InnerContainerMargin>
            <Card mt={[24, 24, 0]} mb={[16, 16, 32]}>
              <CardBody display="flex" flexDirection="column" gridGap="20px">
                <TextField
                  label="Informe um CEP"
                  loading={loading}
                  icon="SearchIcon"
                  onChange={handleZipcode}
                  mask="99999-999"
                  innerRef={zipcodeRef}
                  error={hasError ? "CEP inválido. Por favor, verifique." : ""}
                />
                {displayFields && (
                  <>
                    <Field
                      name="state"
                      render={({ input }) => (
                        <SelectField
                          label="Estado (UF)"
                          options={states}
                          {...input}
                        />
                      )}
                    />
                    <Field
                      name="city"
                      render={({ input }) => (
                        <SelectField
                          label="Cidade"
                          options={cities}
                          {...input}
                        />
                      )}
                    />
                    <Field
                      name="neighbourhood"
                      render={({ input }) => (
                        <TextField label="Bairro" {...input} />
                      )}
                    />
                    <Field
                      name="address"
                      render={({ input }) => (
                        <TextField label="Rua / Avenida" {...input} />
                      )}
                    />
                    <Field
                      name="number"
                      render={({ input }) => (
                        <TextField label="Número" {...input} />
                      )}
                    />
                    <Field
                      name="complement"
                      render={({ input }) => (
                        <TextField label="Complemento" {...input} />
                      )}
                    />
                  </>
                )}
              </CardBody>
              {!addManually && zipcode.length !== CEP_LENGTH && (
                <>
                  <CardDivider />
                  <CardBody>
                    <Button
                      label="Adicionar manualmente"
                      icon="AddMoreIcon"
                      onClick={handleAddMore}
                    />
                  </CardBody>
                </>
              )}
            </Card>
            <Checkbox
              label="Aceito compartilhar meu endereço com empresas parceiras"
              value={agreement}
              onChange={handleCheckbox}
            />
          </InnerContainerMargin>
          <ButtonGroup>
            <ContainedButton
              label="Salvar"
              variant="primary"
              disabled={!isFormValid}
              onClick={onSubmit}
            />
            <ContainedButton label="Cancelar" onClick={handleCancel} />
          </ButtonGroup>
        </InnerContainer>
      </Container>
    </form>
  );
};