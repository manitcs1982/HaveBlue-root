import { Typography, Grid, useTheme, Container } from "@material-ui/core";
import { motion } from "framer-motion";
import { BackButton } from "../../../../common/returnButton";

export const GanttScheduleAndPercentCompleteProfileDetails = () => {
  const theme = useTheme();

  return (
    <div style={theme.container}>
      <Container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid xs={11}>
            <Typography variant="h3">
              Gantt Schedule And Percent Complete Profile
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <BackButton />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum porttitor mi sit amet lacus luctus lobortis. Nam
              tristique, dolor ut varius venenatis, tellus libero luctus urna,
              sit amet tempor sem purus ut orci. Sed eros nulla, dignissim nec
              maximus id, vehicula in leo. Maecenas feugiat dolor dui, in
              posuere dolor sodales id. Donec porttitor rhoncus tellus sagittis
              porta. Orci varius natoque penatibus et magnis dis parturient
              montes, nascetur ridiculus mus. Suspendisse dolor elit, porta nec
              tincidunt nec, dignissim non odio. Duis et pretium purus. Praesent
              est eros, efficitur eget dui malesuada, iaculis dignissim eros.
              Nulla a tristique quam. Duis eget dui ex. Aenean non lacinia
              metus. Cras tempus augue lacus, ac sagittis nibh faucibus vitae.
              Vivamus vel semper justo. Morbi ultrices leo vitae luctus
              vulputate. Nullam non sodales sem. Phasellus quis lacinia justo.
              Integer eu lacinia sem. Donec aliquet eleifend felis et laoreet.
              Mauris eu nulla sapien. Duis eget justo at lectus faucibus
              tristique congue nec metus. Proin orci justo, ornare id odio quis,
              condimentum viverra risus. Suspendisse est diam, tincidunt id
              turpis ut, tristique tempor risus. Quisque eget purus ultrices,
              porta felis vel, dictum nunc. Cras venenatis ac massa vitae
              ultricies. Ut quis tempus libero. Suspendisse eget velit commodo,
              porttitor enim non, tristique tortor. Vivamus at massa eu eros
              pellentesque venenatis sed a dui. Sed aliquet sapien non odio
              feugiat vehicula. Sed imperdiet eros non quam lobortis, id
              efficitur metus ultricies. Cras id pretium nunc. Donec consequat
              id velit quis laoreet. Curabitur at sagittis diam, a viverra
              metus. Proin at convallis ipsum. Curabitur ut convallis velit, eu
              iaculis quam. Donec tellus velit, aliquet vel ligula eget, lacinia
              posuere nulla. Morbi iaculis aliquet turpis non viverra. Maecenas
              volutpat ullamcorper libero at tristique. Nulla risus magna,
              gravida vel sapien vitae, viverra imperdiet ante. Sed eu suscipit
              velit. Ut condimentum at dolor non facilisis. Curabitur sit amet
              volutpat augue. Suspendisse sodales vel lectus et interdum. Cras
              venenatis, sapien tincidunt gravida commodo, dui enim efficitur
              elit, a interdum felis tortor id odio. Mauris efficitur at risus
              non viverra. Donec in diam feugiat, varius justo sit amet,
              efficitur risus. Duis semper tempus eros, vitae gravida urna porta
              semper. Pellentesque vitae scelerisque nulla. Vestibulum dignissim
              mi massa, a ullamcorper leo consequat vel. Nulla sollicitudin diam
              in dui maximus gravida. Nulla pretium, augue at viverra hendrerit,
              tortor diam vestibulum justo, et accumsan est odio eget mauris.
              Proin fermentum lorem in metus ullamcorper varius. Vivamus
              condimentum tellus sit amet odio faucibus euismod. Vestibulum
              ultricies nisi a lectus tempus, accumsan rhoncus eros euismod.
              Pellentesque maximus id tortor et rutrum. Proin ut nisi eget lorem
              interdum euismod. Aliquam iaculis risus nisl, sed facilisis ex
              blandit ac. Aenean varius sit amet justo sit amet tempus. Donec
              erat ligula, venenatis id vehicula ac, dapibus ac elit. Duis
              pellentesque ex sed tellus iaculis, in molestie orci condimentum.
              Pellentesque sagittis vitae ipsum et ultricies. Nullam eros odio,
              rhoncus vitae accumsan eget, venenatis sed mauris. In at rutrum
              dolor. Curabitur enim nulla, rutrum vel sodales et, ornare feugiat
              ligula. Cras vel orci facilisis, sollicitudin diam auctor,
              dignissim nulla. Etiam et nunc laoreet quam tincidunt aliquam.
              Curabitur id urna tristique, interdum massa sit amet, fermentum
              ligula. Vivamus vitae pretium metus.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
