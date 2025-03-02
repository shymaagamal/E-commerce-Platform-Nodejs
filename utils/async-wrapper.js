export const asyncWrapper = (asynFn) => {
  return (req, res, next) => {
    asynFn(req, res, next).catch((err) => {
      next(err);
    });
  };
};