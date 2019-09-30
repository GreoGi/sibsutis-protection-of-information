import * as React from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Title from '../../../components/Title';

import useStyles from './styles';

import {
  LIMIT,
  powByMod,
  extendedGcd,
  DiffieHellman,
  babyStepGiantStep,
  bigintRandom,
  isPrime_byFerma
} from '../../../labs/lab1';

const Lab1: React.FC = () => {
  const classes = useStyles();
  const [a, setA] = React.useState<string>('1');
  const [x, setX] = React.useState<string>('1');
  const [p, setP] = React.useState<string>('1');
  const y = React.useMemo(() => powByMod(BigInt(a), BigInt(x), BigInt(p)), [a, x, p]);
  const [euclidA, setEuclidA] = React.useState<string>('1');
  const [euclidB, setEuclidB] = React.useState<string>('1');
  const [dfCount, setDfCount] = React.useState<boolean>(false);
  const diffieHellman = React.useMemo(() => new DiffieHellman(), [dfCount]);
  const [X1, setX1] = React.useState<string>('1');
  const [X2, setX2] = React.useState<string>('1');
  const Y1 = diffieHellman.generatePublicKey(BigInt(X1));
  const Y2 = diffieHellman.generatePublicKey(BigInt(X2));
  const Z12 = diffieHellman.generateSharedKey(BigInt(Y2), BigInt(X1));
  const Z21 = diffieHellman.generateSharedKey(BigInt(Y1), BigInt(X2));
  const xByBSGS = React.useMemo(() => babyStepGiantStep(y, BigInt(a), BigInt(p)), [y, a, p]);
  const isPPrime = React.useMemo(() => isPrime_byFerma(BigInt(p), 100n), [p]);

  const gcdArray = extendedGcd(BigInt(euclidA), BigInt(euclidB));

  const generateRandomPow = () => {
    setA(String(bigintRandom(1, LIMIT)));
    setX(String(bigintRandom(1, LIMIT)));
    setP(String(bigintRandom(1, LIMIT)));
  }

  const generateRandomPrivateKey = () => {
    setX1(String(bigintRandom(1, Number(diffieHellman.P) - 1)));
    setX2(String(bigintRandom(1, Number(diffieHellman.P) - 1)));
  }

  const handleChangePow = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = BigInt(event.target.value);
    if (value < 1) {
      setter('1');
    } else if (value > LIMIT) {
      setter(String(LIMIT));
    } else {
      setter(event.target.value);
    }
  }

  const handleChangePrivateKey = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = BigInt(event.target.value);
    if (value < 1) {
      setter('1');
    } else if (value > diffieHellman.P - 1n) {
      setter(String(diffieHellman.P - 1n));
    } else {
      setter(event.target.value);
    }
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Title>Быстрое возведение в степень по модулю</Title>
            <Typography variant="body1">
              Лимит на a, x, p до {LIMIT}
            </Typography>
            <div className={classes.wrapper}>
              <TextField
                id="number-a"
                label="a"
                value={a}
                onChange={handleChangePow(setA)}
                type="number"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="number-x"
                label="x"
                value={x}
                onChange={handleChangePow(setX)}
                type="number"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="number-p"
                label="p"
                value={p}
                onChange={handleChangePow(setP)}
                type="number"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={generateRandomPow}
              >
                cлучайно
              </Button>
            </div>
            <Typography variant="body1">
              a^x % p = {y.toString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Title>Расширенный алгоритм Евклида</Title>
            <Typography variant="body1">a * x + b * y = НОД(a, b)</Typography>
            <div className={classes.wrapper}>
              <TextField
                id="number-euclidA"
                label="a"
                value={euclidA}
                onChange={(event) => {
                  setEuclidA(event.target.value);
                }}
                type="number"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="number-euclidB"
                label="b"
                value={euclidB}
                onChange={(event) => {
                  setEuclidB(event.target.value);
                }}
                type="number"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
              <Typography variant="body1">
                {euclidA} * {gcdArray[1].toString()} + {euclidB} * {gcdArray[2].toString()} = {gcdArray[0].toString()}
              </Typography>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Title>Система Диффи-Хеллмана</Title>
            <Typography variant="body1">
              P - безопасное простое число вида 2Q + 1 = P, где Q тоже простое число (Софи Жермен)
            </Typography>
            <Typography variant="body1">
              g - первообразный корень, такое число от {"1 < g < P - 1"},
              что g^Q % P != 1, g^(P-1) % P == 1
            </Typography>
            <div className={classes.wrapper}>
              <Typography variant="body1">
                P = {diffieHellman.P.toString()}, g = {diffieHellman.g.toString()}
              </Typography>
              <Button
                className={classes.dfRegenerate}
                variant="contained"
                color="secondary"
                onClick={() => {
                  setDfCount(!dfCount);
                  // перестраховка
                  setX1('1');
                  setX2('1');
                }}
              >
                перегенерировать
              </Button>
            </div>
            <Typography variant="body1">
              Xi - закрытые ключи вида {'1 <= Xi < P'}
            </Typography>
            <div className={classes.wrapper}>
              <TextField
                id="number-X1"
                label="X1"
                value={X1}
                onChange={handleChangePrivateKey(setX1)}
                type="number"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="number-X2"
                label="X2"
                value={X2}
                onChange={handleChangePrivateKey(setX2)}
                type="number"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={generateRandomPrivateKey}
              >
                cлучайно
              </Button>
            </div>
            <Typography variant="body1">
              Yi - открытые ключи вида Yi = g^Xi % P
            </Typography>
            <Typography variant="body1">
              Y1 = {Y1.toString()}, Y2 = {Y2.toString()}
            </Typography>
            <Typography variant="body1">
              Zij - общие ключи вида Zij = Yj^Xi % P
            </Typography>
            <Typography variant="body1">
              Z12 = {Z12.toString()}, Z21 = {Z21.toString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Title>Шаг младенца, шаг великана</Title>
            <Typography variant="body1">
              Для алгоритма желательно, чтобы p было простым числом. Иначе он изредка может сбоить.
            </Typography>
            <Typography variant="body1">
              Лимит на a, x, p до {LIMIT}
            </Typography>
            <div className={classes.wrapper}>
              <TextField
                id="number-a"
                label="a"
                value={a}
                onChange={handleChangePow(setA)}
                type="number"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="number-x"
                label="x"
                value={x}
                onChange={handleChangePow(setX)}
                type="number"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="number-p"
                label="p"
                value={p}
                onChange={handleChangePow(setP)}
                type="number"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={generateRandomPow}
              >
                cлучайно
              </Button>
              <Typography variant="body1">
                p = {p} - {isPPrime ? 'простое' : 'составное'}
              </Typography>
            </div>
            <Typography variant="body1">
              a^x % p = {y.toString()}
            </Typography>
            <Typography variant="body1">
              y = {y.toString()}
            </Typography>
            <Typography variant="body1">
              x, найденный шагом младенца, шагом великана = {xByBSGS.toString()}
            </Typography>
            <Typography variant="body1">
              Проверка: {a}^{xByBSGS.toString()} % {p} = {powByMod(BigInt(a), xByBSGS, BigInt(p)).toString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Lab1;