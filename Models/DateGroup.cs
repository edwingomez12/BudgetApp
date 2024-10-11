public class DateGroup
{
    public int Year { get; set; }
    public int Month { get; set; }

    public override bool Equals(object obj)
    {
        if (obj is DateGroup other)
        {
            return Year == other.Year && Month == other.Month;
        }
        return false;
    }

     public override int GetHashCode()
    {
        return HashCode.Combine(Year, Month);
    }
}
